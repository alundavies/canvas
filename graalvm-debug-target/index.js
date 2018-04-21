// add to path
//  export PATH=/Library/Java/JavaVirtualMachines/graalvm-1.0.0-rc1/Contents/Home/bin:$PATH
// then >js index.js

function fib( a) {
    if( a<2){
        return 1;
    }
    else {
        return fib( a-1)+fib(a-2);
    }
}

var result = fib(4);

console.log( result);