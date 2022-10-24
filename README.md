<div align="center">
    <img src="https://raw.githubusercontent.com/erwinkulasic/quantu/master/.github/assets/header.jpg" width="800px"/>
</div>

<br>


```
Development:

quantu is currently under development, it is recommended to use it only under caution and at your own risk
```

Quantu allows automatic re-running of package scripts easily. No more manual restart. It uses [chokidar](https://github.com/paulmillr/chokidar) to track file changes. 

<br>


### **Installation**


Use [npm](https://www.npmjs.com/) to install Quantu. 


*To install Quantu globally, run the following bash*
```bash
npm i -g quantu
```

<br>

### **Usage**
If there are no commands defined, Quantu outputs an error message.

Run the default "start" command in package.json.
```
quantu
```


Quantu allows you to execute your own commands
```
quantu --run=test
```


For more CLI options 

```
quantu --help
```
<br>

### **What is special about Quantu**

Quantu starts its own subprocess, the PID is noted, in case of changes or an error the whole subprocess including all small processes is closed and your script is executed again. Quantu tracks all changes e.g. also if you change your script in package.json.
