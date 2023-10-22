# (s)witch (d)irectory

`sd` is a program that allows you to navigate in the file system just like the native `cd` (change directory) command but with extra functionalities. It consists of

1. a binary executable that constructs the directory path to switch to based on the provided arguments,
2. a shell script that changes the directory.

* [Installation](#installation)
* [Usage](#usage)
* [Directory Matching Rules](#directory-matching-rules)
* [Options](#options)

## Installation

To install the program on your machine, go to the [latest release](https://github.com/LexBorisoff/switch-directory/releases) and download the zip file for your specific OS.

> On Windows, you cannot use this program in Powershell. Instead, use a Unix-like shell like Git Bash.

After downloading, copy or move both files inside the folder into a separate directory on your disk. A great place for it could be something like a `~/.sd` directory.

`cd` to the new directory with the files and check permissions for the `sd` executable (`sd.exe` on Windows, `__sd` on Linux and MacOS):

```shell
ls -l
```

If the file lacks the execute permission (`x`), add it with the `chmod` command:

On Windows (git-bash):

```shell
chmod +x sh.exe
```

On Linux and MacOS:

```shell
chmod +x __sh
```

Next, to make the `sd` function available globally, you need to source the `sd.sh` file on each shell startup. Open the `.bashrc` or `.bash_aliases` file (or similar, depending on your shell) and add the following line:

```sh
source ~/.sd/sd.sh
```

> Change the file path if you saved it in a different directory.

After restarting your shell, the command should be available.

## Usage

The command accepts a list of arguments separated by whitespace and performs a directory lookup for each one starting from the current directory and `cd`-ing to the found directory represented by each subsequent argument.

```bash
sd dir1 dir2 dir3 ...
```

For example, assuming we have the following folder structure:

```
~/
 |-dev
   |-projects
     |-nodejs
       |-apis
       |-clis
     |-react
     |-deno
   |-practice

 |-personal
   |-photos
   |-spreadsheets
```

and would like to switch to the `~/dev/projects/nodejs/clis` folder from `~/`, we could do the following:

```shell
sd dev proj node cli
```

> See [directory matching rules](#directory-matching-rules) to learn how directory names are matched.

### Paths

You can also use a single relative or absolute path argument (same as `cd`):

```bash
sd ./dir1/dir2/dir3
```

```bash
sd ../../../
```

```bash
sd ~/di1/dir2/dir3
```

```bash
sd /
```

## Directory Matching Rules

The way that the program constructs the final path is as follows:

* For each provided argument, it searches a directory name  that should match that argument.
* The search starts at the current directory or at the directory specified by the [-root](#option-root) option.
* If a directory name is found, the program adds it to the final path and does the same lookup inside of that found directory for the next argument in the list.
* The process continues until the last argument or until an argument could not be matched.

The directory lookup for each argument is done in the following order:

1. a directory ***fully matches*** the argument
2. a directory ***starts with*** the argument
3. a directory ***ends with*** the argument
4. a directory ***includes*** the argument

Following our example from above (switching to `~/dev/projects/nodejs/clis`), we could achieve the same result by typing the following:

```shell
sd ev ojec dejs li
```

Note that the program will grab the first found directory matching the provided argument. So, if we were to supply `is` as the last argument, then  both `apis` and `clis` could potentially be matched, but since `apis` comes up first, the program will use that directory.

Each argument is allowed to be at least 1 character, so it is important to remember the above rule since there could be multiple directories that start or end with, or (especially) include that 1 character.

And lastly, if an argument cannot match any of the directories, the program will stop at the last found directory without going any further and will display a message telling you which argument could not be matched.

## Options

There are a few useful options you can supply to the command.

### `-root` `-r` <a name="option-root"></a>

This option specifies the starting directory from which to begin the switching process. For example, if you are located in the `~/` directory but want to start from `C:\Program Files` (on Windows), you can do the following:

```shell
sd -r=Program\ Files dir1 dir2 ...
```

This option is useful when you want to create aliases that could quickly switch and start `sd`-ing from a pre-defined directory. For example:

```sh
alias dev='sd -r=~/dev'
alias pf='sd -r=/c/Program\ Files'
```

> The option value must be provided with an `=` sign, otherwise it won't work properly.

The above allows you to use the `dev` and `pf` commands to move and start navigating from the `~/dev` and `C:\Program Files` (on Windows) directories, respectively, no matter where you are currently in the file system.

### `-i` <a name="option-i"></a>

Performs case-insensitive directory lookups.


```shell
sd myDirectory -i
```

This would match directories like `mydirectory`, `MYDIRECTORY`, `MyDiReCtOrY`, and so on...