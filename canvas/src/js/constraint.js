/* Example of an 'assertion' language */

function pictureIt() {

    const A = new Circle
    const B = new Circle
    const C = new Circle

    let time = 0

    setInterval( () => {
        time = new Date().getTime()
    }, 300)

    A.center = [ Math.sin( time), Math.cos( time) ]

    B.center <- A.center
    C.center <- [ A.center, A.center + 1]

    B.radius <- A.radius + 1;
}

class Circle {

    constructor(){

    }

    drawConstructor() {
        // create node
    }


}

pictureIt()



things that cause a thread to keep going and going

loops and recursion (recursion fixed by making all functions asynchronous)

while do for


function tryIt(){

    let i=1;

    while( i<10){
        i++
    }

    console.log( i)
}


function tryIt(){

    let i = 1;

    let whileBodyAndCondition = () => {

        if( i<10){
            i++;
            setTimeout( whileBodyAndCondition, 0);
        } else {
            console.log( i)
        }

    };
    whileBodyAndCondition();

}
tryIt()




loop condition {
    body statements
}



setTimeout( function)
