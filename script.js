const subjectData = {
    title: "Sample Subject",
    runningCodes: [
        {
        first: "lex lex.l",
        either: "yacc -d yacc.y",
        second: "gcc lex.yy.c",
        duplicate: "gcc lex.yy.c y.tab.c",
        third: "./a.out input.txt",

        }
    ],
    questions: [
        {
            question: "Count the number of comments, keywords, identifiers, words, lines, and spaces from input file.",
            code: `
%{
    int c=0,k=0,l=0,i=0,s=0;
    extern FILE *yyin;
%}


alpha [a-zA-Z]
digit [0-9]
comment "//".*
keyword (if|else|for|while|switch|case|break|continue|return|int|float|double|string|boolean)
identifier {alpha}({alpha}|{digit})*
line [\ n]+ // remove space
space [ \ t]+ // remove space

%%

{comment} {c++;}
{keyword} {k++;}
{identifier} {i++;}
{line} {l++;}
{space} {s++;}
. ;

%%

int yywrap(){
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;
    
    yylex();
    if(l>0){
        l+=1;
    }
    printf("Comments: %d",c);
    printf("Keywords: %d",k);
    printf("Identifiers: %d",i);
    printf("Lines: %d",l);
    printf("Spaces: %d",s);
    printf("Words: %d",i+k+c);

    fclose(fp);
    return 0;   
}
    `,
input: `
asda
asdas
digit
// hello
bye 123
1
// see
int
for
`,
        },
        {
            question: "Count number of words starting with ‘A’.",
            code: `
%{
    int count =0;
    extern FILE *yyin;    
%}

alpha [a-zA-Z]*
start (A|a){alpha}

%%
{start} {count+=1;}
.|\ n ; // remove space
%%

int yywrap(){
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;

    yylex();
    printf("Words:- %d",count);

    fclose(fp);
    return 0;
}
    `,
input: `
hello
hi
ansh
bye
Ansh
see Ansh
1233232
`,
        },
        {
            question: "Conversion of lowercase to uppercase and vice versa.",
            code: `
%{
    extern FILE *yyin;
%}

lower [a-z]
upper [A-Z]
space [ \ s] // remove space

%%

{lower} {printf("%c", yytext[0] - 32);}
{upper} {printf("%c", yytext[0] + 32);}
\ n {printf("\ n");}  // remove space
\ t {printf("\ t");}  // remove space
{space} {printf(" ");}
. ;

%%

int yywrap(){
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;

    yylex();

    fclose(fp);
    return 0;
}
    `,
input: `
hello
Hi
ByE HeLlO
`,
        },
        {
            question: "Conversion of decimal to hexadecimal number in a file.",
            code: `
%{ 
    int num, r, hex_index = 0, i;
    char a[20];
    extern FILE *yyin;
%} 

DIGIT [0-9]+
NON_DIGIT [^0-9]+

%% 

{DIGIT} { 
    num = atoi(yytext);

    hex_index = 0;
    do {
        r = num % 16;
        if (r < 10) {
            a[hex_index++] = '0' + r;
        } else {
            a[hex_index++] = 'A' + (r - 10);
        }
        num = num / 16;
    } while (num != 0);

    
    for (i = hex_index - 1; i >= 0; i--) {
        printf("%c", a[i]);
    }
}

{NON_DIGIT} { 
    printf("%s", yytext);
}

%% 

int yywrap() {
    return 1;
}

int main(int argc, char *argv[]) { 
    FILE *fp = fopen(argv[1], "r+");
    yyin = fp;
    yylex(); 
    fclose(fp);
    return 0; 
}
    `,

input: `
Anujesh 10
12 Bye
Bye10Bye
`,

        },
        {
            question: "Test lines ending with \".com\".",
            code: `
%{
    int count =0;  
    extern FILE *yyin;
%}

alpha [a-zA-Z]
digit [0-9]
symbol [^{alpha}{digit} \ t \ n] // remove space
content ({alpha}|{digit}|{symbol})+".com"

%%
{content} {count += 1;}
.| \ n ; // remove space
%%
int yywrap(){
    return 1;
}
int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;
    yylex();
    printf("Count:- %d \ n",count); // remove space
    fclose(fp);
    return 0;
}
    `,
input: `
anujesh@gmail.com
a.com
bye bye.com
see u soon.com
comasdasdasdasdasdGmain@gmail.com
asd
@.com
`,
        },

        {
            question: "Postfix Expression Evaluation YACC.",
            code: `
%{
#include "y.tab.h"
%}

digit   [0-9]+
%%
{digit}    { yylval = atoi(yytext); return NUM; }
"+"        { return PLUS; }
"-"        { return MINUS; }
"*"        { return MULTIPLY; }
"/"        { return DIVIDE; }
\ n         { return EOL; } // remove space
[ \ t]      ;  // remove space
.          ;
%%

int yywrap() {
    return 1;
}
`,
            input: `
            %{
#include <stdio.h>
#include <stdlib.h>

int yylex();
void yyerror(const char *s);

void push(int);
int pop();
int stack[100], sp = 0;
%}

%token NUM
%token PLUS MINUS MULTIPLY DIVIDE EOL
%left PLUS MINUS
%left MULTIPLY DIVIDE
%%
S: E EOL { printf("= %d\n", pop()); }
      ;

E: NUM          { push($1); }
    | E E PLUS    { int b = pop(); int a = pop(); push(a + b); }
    | E E MINUS   { int b = pop(); int a = pop(); push(a - b); }
    | E E MULTIPLY { int b = pop(); int a = pop(); push(a * b); }
    | E E DIVIDE  { int b = pop(); int a = pop(); push(a / b); }
    ;
%%

void push(int val) {
        stack[sp++] = val;
}

int pop() {
    if (sp > 0) {
        return stack[--sp];
    } else {
        yyerror("Error: Stack underflow");
        exit(1);
    }
}

void yyerror(const char *s) {
    printf("Error: %s", s);
}

int main() {
    printf("Enter postfix expressions: ");
    return yyparse();
}
`,
            },
        
            {
                question: "Desk Calculator with Error Recovery YACC.",
                code: `
                %{
#include "y.tab.h"
%}

digit   [0-9]

%%
{digit}+(\.{digit}+)?   { yylval.val = atof(yytext); return NUM; }  // add slash every where, here before the .
[\ t ]+                  ; // remove Space
\ n                      { return '\ n'; } // remove Space
"+"                     { return '+'; }
"-"                     { return '-'; }
"*"                     { return '*'; }
"/"                     { return '/'; }
.                       { return yytext[0]; }

%%

int yywrap() {
    return 1;
}

                `,
                input: `
%{
#include <stdio.h>
#include <stdlib.h>
void yyerror(const char *s);
int yylex();
%}

%union {
    double val;
}

%token <val> NUM
%type <val> E

%left '+' '-'
%left '*' '/'
%right UMINUS

%%

S: E
    ;

E:
    '\ n'
    | E '\ n' { printf("Result: %f \ n", $1); } // remove Space
    | error '\ n' { yyerror("Invalid expression, try again."); yyerrok; }// remove Space
    ;

E:
    NUM         { $$ = $1; }
    | E '+' E { $$ = $1 + $3; }
    | E '-' E { $$ = $1 - $3; }
    | E '*' E { $$ = $1 * $3; }
    | E '/' E { if ($3 == 0) { yyerror("Division by zero"); $$ = 0; } else { $$ = $1 / $3; } }
    | '-' E %prec UMINUS { $$ = -$2; }
    | '(' E ')' { $$ = $2; }
    ;

%%

void yyerror(const char *s) {
    fprintf(stderr, "%s \ n", s);// remove Space
}

int main() {
    printf("Enter expressions for evaluation: \ n");// remove Space
    yyparse();
    return 0;
}
`,
},

                {
                    question: "For Loop Syntax Checking YACC.",
                    code: `
%{
#include "y.tab.h"
%}

%%

"for"               { return FOR; }
"("                 { return '('; }
")"                 { return ')'; }
";"                 { return ';'; }
"{"                 { return '{'; }
"}"                 { return '}'; }
[a-zA-Z_][a-zA-Z0-9_]* { return ID; }
[0-9]+              { yylval = atoi(yytext); return NUM; }
"="                 { return '='; }
"<"                 { return '<'; }
"++"                { return INCR; }
"+"                 { return '+'; }
[ \ t \ n]+            ;  // remove space
.                   { printf("Unknown character: %s", yytext); }

%%

int yywrap() {
    return 1;
}

                    `,
                    input: `
%{
#include <stdio.h>
#include <stdlib.h>

void yyerror(const char *s);
int yylex(void);

%}

%token ID NUM FOR INCR

%%

S: FOR
       ;

FOR: FOR '(' i ';' c ';' j ')' '{' body '}'
        {
            printf("Parsed a simple FOR loop.");
            exit(0);
        }
        ;

i: ID '=' NUM
              ;

c: ID '<' NUM
         ;

j: ID INCR
         ;
body: ID '=' ID '+' NUM ';';

%%

int main() {
    printf("Enter a simple FOR loop to parse: ");
    return yyparse();
}

void yyerror(const char *s) {
    fprintf(stderr, "Error: %s\ n", s); // remove space
}

                    `,
                    },

                    {
                        question: "Intermediate Code Generation YACC.",
                        code: `
%{
#include "y.tab.h"
#include <string.h>
%}

%%

[a-zA-Z_][a-zA-Z0-9_]* { yylval.str = strdup(yytext); return ID; } 
[0-9]+                  { yylval.str = strdup(yytext); return NUM; } 
"-"                     { return '-'; }
"+"                     { return '+'; }
"*"                     { return '*'; }
"/"                     { return '/'; }
"="                     { return '='; }
"("                     { return '('; }
")"                     { return ')'; }
[ \ t \ n]+                ;  // remove space
.                       {  }

%%

int yywrap() {
    return 1;
}

                        `,
                        input: `
                        %{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void yyerror(const char *s);
int yylex();

int temp_count = -1;
char* stack[100];
int top = -1;

void codegen(const char *op);
void codegen_umin();
void codegen_assign(char *id);
void push(char *text);
char* pop();

%}

%union {
    char *str;
}

%token <str> ID NUM

%left '+' '-'
%left '*' '/'

%%

S: ID '=' E { codegen_assign($1); }
 ;

E: E '+' T { codegen("+"); }
 | E '-' T { codegen("-"); }
 | T
 ;

T: T '*' F { codegen("*"); }
 | T '/' F { codegen("/"); }
 | F
 ;

F: '(' E ')' 
 | '-' F  { codegen_umin(); }
 | ID     { push($1); }
 | NUM    { push($1); }
 ;

%%

int main() {
    printf("Enter an arithmetic expression: ");
    return yyparse();
}

void yyerror(const char *s) {
    fprintf(stderr, "Error: %s \ n", s); // remove space
}

void push(char *text) {
    stack[++top] = strdup(text);
}

void codegen(const char *op) {
    char* right = pop();
    char* left = pop();
    
    temp_count++;
    
    printf("t%d = %s %s %s \ n", temp_count, left, op, right); // remove space
    
    free(left);
    free(right);
    
    char temp[10];
    snprintf(temp, sizeof(temp), "t%d", temp_count);
    push(temp);
}

void codegen_umin() {
    char* val = pop();
    temp_count++;
    
    printf("t%d = -%s \ n", temp_count, val); // remove space
    free(val);
    
    char temp[10];
    snprintf(temp, sizeof(temp), "t%d", temp_count);
    push(temp);
}

void codegen_assign(char *id) {
    char* val = pop();
    printf("%s = %s \ n", id, val); // remove space
    free(val);
}

char* pop() {
    if (top == -1) {
        yyerror("Stack underflow");
        exit(1);
    }
    return stack[top--];
}
                        `,
                        },


// // Format of the Code Snippet
{
question: "LEX program to implement a simple calculator.",
code: `
%{
#include "y.tab.h"
#include <stdio.h>
#include <stdlib.h>
%}

%%
[0-9]+ {yylval = atoi(yytext); return NUM;}
[-+*/] {return yytext[0];}
\ n {return '\ n';} //remove space
. ;
%%

int yywrap(){
    return 1;
}

`,
input: `
%{
#include <stdio.h>
#include <stdlib.h>

int yylex();
void yyerror(const char *s);

%}

%token NUM

%left '+' '-'
%left '*' '/'

%%
S : E '\ n' {printf("Result = %d\ n",$1);exit(0);} //remove space
  | error '\ n' {yyerror("invalid, try again."); yyerrok;} //remove space
  ;

E : E '+' E {$$ = $1 + $3;}
  | E '-' E {$$ = $1 - $3;}
  | E '*' E {$$ = $1 * $3;}
  | E '/' E {$$ = $1 / $3;}
  | NUM {$$ = $1;}
  ;
%%

void yyerror(const char *s){
    printf("Error:- %s\ n",s); //remove space
    exit(1);
}

int main(){
    printf("Enter Expression:- ");
    yyparse();
    return 0;
}
`,
},




        {
            question: "LEX program to check a valid email address.",
            code: `
%{
    int count = 0;
    extern FILE *yyin;
%}

alpha [a-zA-Z]
digit [0-9]
symbol [._&+%'!~#-]
end (in|com|org|edu|eu|ru)

%%
({alpha}|{digit})+({symbol}|{alpha}|{digit})*"@"{alpha}+({alpha}|{digit}|-)*"."{end} { count++; }
%%

int yywrap() {
    return 1;
}

int main(int argc, char *argv[]){
    FILE *fp = fopen(argv[1],"r+");
    yyin = fp;
    yylex();
    printf("count:- %d",count);
    fclose(fp);
    return 0;
}
    `,
input: `
anshanujesh@gmail.com
john.doe@gmail.com
user123@example.com
name_surname@yahoo.com
info@my-site.org
john..doe@gmail.com
user@.com
name@domain..com
$user@gmail.com
user@domain.com!
example@domain@domain.com
name@domain.c
user@domain#example.com
first.last@sub.domain.com
123456@gmail.com
example+filter@gmail.com
`,
        },
        {
            question: "Postfix to Infix Conversion YACC.",
            code: `
%{
#include <stdio.h>
#include <stdlib.h>
#include "y.tab.h"
%}

DIGIT [0-9]+

%%
{DIGIT}  { yylval.str = strdup(yytext); return ID; }
[-+*/]   { return yytext[0]; }
[ \ t \ n]  ; //remove space
.        ;

%%

int yywrap() {
    return 1;
}

    `,
input: `
%{
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int yylex();
void yyerror(const char *s);

void push(char *text);
char *pop();
char *top();
void codegen_infix(char *op);

char *s[100];
int t = 0;

%}

%union {
    char *str;
}

%token <str> ID

%%

S   : E { printf("= %s \ n", top()); } //remove space
    ;

E   : E E '+' { codegen_infix(" + "); }
    | E E '-' { codegen_infix(" - "); }
    | E E '*' { codegen_infix(" * "); }
    | E E '/' { codegen_infix(" / "); }
    | ID      { push($1); }
    ;

%%

void push(char *text) {
    s[t++] = strdup(text);
}

char* pop() {
    return s[--t];
}

char* top() {
    return s[t - 1];
}

void codegen_infix(char* op) {
    char buffer[100];
    char *right = pop();
    char *left = pop();
    
    snprintf(buffer, sizeof(buffer), "(%s %s %s)", left, op, right);
    
    
    push(buffer);
    
    
    free(left);
    free(right);
}

void yyerror(const char *s) {
    printf("Error: %s\ n", s); //remove space
}

int main() {
    printf("Enter a postfix expression:\ n"); //remove space
    yyparse();
    return 0;
}

`,
        },
        {
            question: "Infix to Postfix Conversion YACC.",
            code: `
%{
#include "y.tab.h"
#include <stdlib.h>
#include <string.h>

char buffer[100];
%}

ALPHA [A-Z a-z]
DIGIT [0-9]

%%
{ALPHA}({ALPHA}|{DIGIT})*   { yylval.str = strdup(yytext); return ID; }
{DIGIT}+                    { yylval.str = strdup(yytext); return ID; }
[\ n \ t]                     ; //remove space
.                           { yylval.str = strdup(yytext); return yytext[0]; }
%%

int yywrap() { return 1; }

    `,
input: `
%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int yylex();
void yyerror(const char *s);

void A1(char *op);
void A2();
void A3(char *operand);

char stack[100][100];
int stack_top = 0;

void yyerror(const char *s);
%}

%union {
    char *str;
}

%token <str> ID
%left '+' '-'
%left '*' '/'
%left UMINUS

%%

S    :    E        { printf("\ n"); } //remove space
      ;

E    :    E '+' { A1("+"); } T { A2(); }
      |    E '-' { A1("-"); } T { A2(); }
      |    T
      ;

T    :    T '*' { A1("*"); } F { A2(); }
      |    T '/' { A1("/"); } F { A2(); }
      |    F
      ;

F    :    '(' E ')'       { A2(); }
      |    '-' F          { A1("-"); }
      |    ID             { A3($1); }
      ;

%%

void A1(char *op) {
    strcpy(stack[stack_top++], op);
}

void A2() {

    printf("%s", stack[--stack_top]);
}

void A3(char *operand) {

    printf("%s", operand);
    free(operand); 
}

int main() {
    printf("Enter infix expression: ");
    yyparse();
    return 0;
}

void yyerror(const char *s) {
    printf("Error: %s\ n", s); //remove space
}


`,
        },
    ]
};



// Render the running codes and questions with copy buttons
function renderPageContent() {
    const runningCodesContainer = document.getElementById("running-codes");
    const questionsContainer = document.getElementById("questions-container");

    // Render running codes
    subjectData.runningCodes.forEach(codeObj => {
        // Use the specific keys (first, second, third) to create code snippets
        for (const key in codeObj) {
            if (codeObj.hasOwnProperty(key)) {
                // Create a code snippet with the key as the label
                runningCodesContainer.appendChild(createCodeSnippet(codeObj[key], key));
            }
        }
    });

    // Render questions
    subjectData.questions.forEach((item, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `<h2>Question ${index + 1}: <span>${item.question}</span></h2>`;
        
        questionDiv.appendChild(createCodeSnippet(item.code, "lex.l"));
        questionDiv.appendChild(createCodeSnippet(item.input, "input.txt"));
        
        questionsContainer.appendChild(questionDiv);
    });
}

// Helper function to create a code snippet element with a copy button
function createCodeSnippet(content, label) {
    const container = document.createElement("div");
    const pre = document.createElement("pre");
    const codeElem = document.createElement("code");
    codeElem.textContent = content;

    // Make the whole pre element clickable to copy
    pre.onclick = () => handleCopy(content, null);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.className = "copy-btn";
    copyBtn.onclick = (event) => {
        event.stopPropagation(); // Prevent the pre click from firing
        handleCopy(content, copyBtn);
    };

    container.innerHTML = `<strong>${label}:</strong>`;
    pre.appendChild(codeElem);
    pre.appendChild(copyBtn);
    container.appendChild(pre);
    
    return container;
}

// Copy code to clipboard and change button state
function handleCopy(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        if (button) {
            button.textContent = "Copied";
            button.style.backgroundColor = "#3a3d40";
            setTimeout(() => {
                button.textContent = "Copy";
                button.style.backgroundColor = "#238636";
            }, 2000);
        }
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

// Initialize page content
document.addEventListener("DOMContentLoaded", renderPageContent);