function miClasePadre() {
    this.atributo1 = '';
    this.atributo2 = '';
    this.atributo3 = '';
    this.constructorPrincipal = function (atr1, atr2, atr3) {
        this.atributo1 = atr1;
        this.atributo2 = atr2;
        this.atributo3 = atr3;
    };
    this.constructor = function (a1, a2, a3) {
        this.constructorPrincipal(a1, a2, a3);
    };
    this.getAtributo1 = function () {
        return this.atributo1;
    };
}