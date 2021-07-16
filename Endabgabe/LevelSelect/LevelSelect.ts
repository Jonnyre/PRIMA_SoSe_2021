namespace Endabgabe {
    window.addEventListener("load", init);

    async function init(): Promise<void> {
        let level1: HTMLDivElement = <HTMLDivElement> document.getElementById("level1");
        level1.addEventListener("click", () => clickLevel(1));

        let level2: HTMLDivElement = <HTMLDivElement> document.getElementById("level2");
        level2.addEventListener("click", () => clickLevel(2));

        let level3: HTMLDivElement = <HTMLDivElement> document.getElementById("level3");
        level3.addEventListener("click", () => clickLevel(3));

        let level4: HTMLDivElement = <HTMLDivElement> document.getElementById("level4");
        level4.addEventListener("click", () => clickLevel(4));

        let level5: HTMLDivElement = <HTMLDivElement> document.getElementById("level5");
        level5.addEventListener("click", () => clickLevel(5));
    } 

    function clickLevel(_level: number): void {
        window.location.href = "../Endabgabe.html?id=" + _level;
    }
}