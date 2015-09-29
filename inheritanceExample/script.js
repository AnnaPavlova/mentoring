function Quadrate(a) {
    if (!(this instanceof Quadrate)) {
        return new Quadrate(a);
    }
    this.sideA = a || 0;
}
Quadrate.prototype.getSquare = function () {
    return this.sideA * this.sideA;
};

function Parallelogram(a, b) {
    if (!(this instanceof Parallelogram)) {
        return new Parallelogram(a, b);
    }
    Quadrate.apply(this, arguments);
    this.sideB = b || 0;
}
Parallelogram.prototype = Object.create(Quadrate.prototype);
Parallelogram.prototype.constructor = Parallelogram;

Parallelogram.prototype.getSquare = function () {
    return this.sideA * this.sideB;
};

function Rectangle(a, b, c) {
    if (!(this instanceof Rectangle)) {
        return new Rectangle(a, b, c);
    }
    Parallelogram.apply(this, arguments);
    this.corner = c || 0;
}
Rectangle.prototype = Object.create(Parallelogram.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getSquare = function () {
    return Parallelogram.prototype.getSquare.call(this) * Math.sin(this.corner);
};

// test
console.log("Quadrate S =", new Quadrate(10).getSquare());
console.log("Parallelogram S =", new Parallelogram(30, 2).getSquare());
console.log("Rectangle S =",  new Rectangle(5, 3, 2).getSquare());