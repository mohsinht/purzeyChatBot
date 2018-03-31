#define LINE_LEN     80
#define MAX_ARGS     64
#define MAX_ARG_LEN  16
#define MAX_PATHS    64
#define MAX_PATH_LEN 96
#define WHITESPACE   " .,\t\n"

#ifndef NULL
#define NULL 0
#endif

#include <iostream>
#include <string.h>
#include <cstdlib>
#include <unistd.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <fstream>

using namespace std;

struct command_t {
  char *name;
  int argc;
  char *argv[MAX_ARGS];
};

char *lookupPath(char **, char **);
int parseCommand(char *, struct command_t *);
int parsePath(char **);
void printPrompt();
void readCommand(char *);
int sepPipes(char* commandLine, char** allCommands, char*& outFile);

int main(){
	char** pathv = new char*[MAX_PATHS];
	char* commandLine = new char[LINE_LEN];
	char** allCommands = new char*[LINE_LEN];
	command_t command;
	char* outFile = new char[LINE_LEN];
	int fd1, fd;
	char * myfifo = "/tmp/myfifo";
	char * myfifo2 = "/tmp/myfifo";
	mkfifo(myfifo, 0666);


	int pfd[2];
	pipe(pfd);
	int x;
	x= parsePath(pathv);
	while(true){
		int numOfCommands = 0;
		printPrompt();
		readCommand(commandLine);
		numOfCommands = sepPipes(commandLine, allCommands, outFile);
		if(!numOfCommands){
			continue;
		}
		if(numOfCommands < 2){
				bool flg = true;
				int dum = parseCommand(allCommands[0], &command);
				command.name = lookupPath(command.argv, pathv);
				if(command.name == NULL){
					continue;
				}
				pid_t pid1 = fork();
				if(pid1 == 0){
					if(strlen(outFile)>2){
        				dup2(pfd[1], 1);
        				close(pfd[1]);
					}
					execv(command.name,command.argv);
					flg = false;
				}
				
				if(strlen(outFile)>2){
					cout << "OUTPUT WRITTEN TO FILE: " << outFile << endl;
					char* outS = new char[1000];
					read(pfd[0], outS, 1000);
					close(pfd[0]);
					ofstream fout;
					fout.open(outFile, ofstream::trunc);
					if(!fout.is_open()){
						cout << "CANT OPEN FILE!";
					}
					int i2 = 0;
					while(i2<strlen(outS)){
						fout << outS[i2];
						i2++;
					}
					outFile[0] = '\0';
				}
				else{
					wait(NULL);
				}

				if(flg){
					cout << "Command ran successfully!" << endl;
				}
				else{
					cout << "Command FAILED!" << endl;
				}
		}else{
			int pfd1[2];
			int pfd2[2];
			pipe(pfd1);
			pipe(pfd2);
			char* outS = new char[1000];
			//ASSIGNMENT 2 : PIPE EXTENSION:
			for(int i=0; i<numOfCommands; i++){
				bool fff = true;
				int dum = parseCommand(allCommands[i], &command);
				command.name = lookupPath(command.argv, pathv);
				if(command.name == NULL){
					continue;
				}
				pid_t pid = fork();
				if(pid == 0){
					if(i == 0){
						dup2(pfd1[1], 1);
        				close(pfd1[1]);
        				close(pfd1[0]);
						execv(command.name,command.argv);
					}
					if(i == numOfCommands-1){
						if(numOfCommands <= 2){
							dup2(pfd1[0], 0);
	        			}
	        			else{
	        				dup2(pfd2[0], 0);
	        				close(pfd2[0]);
	        			}
						execv(command.name,command.argv);						
					}
					if(i>0){

						dup2(pfd1[0], 0);

        				dup2(pfd2[1], 1);
        				
        				close(pfd1[0]);
        				close(pfd2[1]);

						execv(command.name,command.argv);
					}
				}
				
				
				if(strlen(outFile)>1 && i == numOfCommands-1){
					//wait(NULL);
					cout << "OUTPUT WRITTEN TO FILE: " << outFile << endl;
					
					if(numOfCommands<=2){
						read(pfd1[0], outS, 1000);
						close(pfd1[0]);
					}
					else{
						read(pfd2[0], outS, 1000);
						close(pfd2[0]);
					}
					ofstream fout;
					fout.open(outFile, ofstream::trunc);
					if(!fout.is_open()){
						cout << "CANT OPEN FILE!";
					}
					int i2 = 0;
					while(i2<strlen(outS)){
						fout << outS[i2];
						i2++;
					}
					outFile[0] = '\0';
				}
				close(pfd1[1]);
			}

		}
	}
	return 0;
}



void printPrompt(){
	string name=getenv("USER");

	string promptString=name+"@ubuntu: ";
	cout << promptString;
}


void readCommand(char *buffer) {
	  cin.getline(buffer, 100);  
}


int parsePath(char ** pathv) {
/* This function reads the PATH variable for this
 * environment, then builds an array, pathv, of the
 * directories in PATH
 */
  char *pathEnvVar = new char[1000];
  char *thePath = new char[1000];

  for (int i=0; i < MAX_PATHS; i++)
	  pathv[i] = NULL;
	  pathEnvVar = getenv("PATH");
	  thePath = (char *) malloc(strlen(pathEnvVar) + 1);
	  strcpy(thePath, pathEnvVar);

	int j=0;
	while((pathv[j] = strsep(&thePath,":")) != NULL){
		j++;
	}

	return 0;
}


int parseCommand(char * commandLine, struct command_t * command){
	char* Slice = strtok(commandLine, WHITESPACE);
	int i=0;
	command->name = Slice;
	while(Slice!=NULL){
		command->argv[i++] = Slice;
		Slice = strtok(NULL, WHITESPACE);
	}
	command->argc = i;
	command->argv[command->argc] = NULL;
}

char* lookupPath(char** argv,char* pathv[]){
/* This function searches the directories identified by the dir
 * argument to see if argv[0] (the file name) appears there.
 * Allocate a new string, place the full path name in it, then
 * return the string.
 */
	char* result = new char[MAX_PATH_LEN];
	char* newArray[MAX_ARGS];
	string pathName;

	for(int i=0;i<MAX_ARGS;i++){
		newArray[i]=pathv[i];
	}
// Check to see if file name is already an absolute path
	if(*argv[0] == '/'){
		return argv[0];
	}

// Look in PATH directories.
// Use access() to see if the file is in a dir.
	int check=-5;
	for(int i=0;newArray[i]!=NULL;i++){
		string h(newArray[i]);
		pathName= h + "/"; 
		pathName = pathName + argv[0];
		strcpy(result,pathName.c_str());
		check = access(result,F_OK);
		if(check==0)
			return result;
	}
	// File name not found in any path variable
	cout << argv[0] << " : command not found!" << endl;
	return NULL;
}


int sepPipes(char* commandLine, char** allCommands, char*& outFile){

	int size = 0;
	if(strlen(commandLine) < 2){
		allCommands = NULL;
		return size;
	}
	char* Slice = strtok(commandLine, "|");
	int i=0;
	while(Slice!=NULL){
		allCommands[i] = Slice;
		Slice = strtok(NULL, "|");
		i++;
	}
	for(int j=0; j< strlen(allCommands[i-1]); j++){
		if(allCommands[i-1][j] == '>'){
			char* firstp = strtok(allCommands[i-1], ">");
			outFile = strtok(NULL, "|");
			allCommands[i-1][j] = '\0';
		}
	}
	size=i;
	/*
	cout << "SIZE = " << size << endl;
	cout << "COMMANDS: " << endl;
	for(int k=0; k<size; k++){
		cout << k <<". " << allCommands[k] << endl;
	}
	cout << "FILE OUTPUT = " << outFile << endl;
	cin >> size;

	*/
	return size;
}


//ls | grep "out"