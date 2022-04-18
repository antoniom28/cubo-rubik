var app = new Vue(
    {
        el: "#root",
        data: {
            cube: {
                frontFace: ["white", "white", "white", "white", "white", "white", "white", "white", "white"],
                rightFace: ["green", "green", "green", "green", "green", "green", "green", "green", "green"],
                backFace: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
                leftFace: ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
                facciaTop: ["red", "red", "red", "red", "red", "red", "red", "red", "red"],
                facciaBottom: ["orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"],
            },
            start: false,
            first: true,
            rotY: 0,
            rotX: 0,
            startX: 0,
            startY: 0,
            changed: true,
            mainFront: null,
            mainBack: null,
            mainLeft: null,
            mainRight: null,
            rememberShuffle: [],
            noClick: false,
            speedAuto: 300,
            speedShuffle: 300,
        },
        methods: {
            cubeMove: function () {
                let moveX = event.clientX;
                let moveY = event.clientY;
                this.startX = moveX;
                this.startY = moveY;
                this.start = !this.start;

                cube.style.transition = 'all 0.3s linear';
                cube.style.cursor = "grabbing";
            },
            cubeStopMove: function () {
                cube.style.cursor = "grab";
                cube.style.transition = 'all 0.1s linear';
                let moveX = event.clientX;
                let moveY = event.clientY;
                this.finalX = moveX;
                this.finalY = moveY;
                let diffX = this.startX - this.finalX;
                let diffY = this.startY - this.finalY;

                if (Math.abs(diffX) > Math.abs(diffY))
                    if (diffX > 0)
                        this.rotY -= 45;
                    else if (diffX < 0)
                        this.rotY += 45;

                if (Math.abs(diffX) < Math.abs(diffY))
                    if (diffY > 0)
                        this.rotX += 45;
                    else if (diffY < 0)
                        this.rotX -= 45;

                if (this.rotX > 45)
                    this.rotX = 45;
                if (this.rotX < 0)
                    this.rotX = -45;

                if (this.rotY == 360 || this.rotY == -360) {
                    cube.style.transition = 'none';
                    this.rotY = 0;
                    setTimeout(() => {
                        cube.style.transition = 'all 0.1s linear';
                    }, 0);
                }

                cube.style.transform = `rotateY(${this.rotY}deg) rotateX(${this.rotX}deg)`;
            },
            shuffle: function () {
                if (this.noClick)
                    return;
                    
                this.noClick = true;
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        let rot = Math.floor(Math.random() * 2);
                        let dirRow = Math.floor(Math.random() * 2);
                        let dirCol = Math.floor(Math.random() * 2 + 2);
                        let dirArr = ['left', 'right', 'up', 'down'];
                        let rowOrCol = Math.floor(Math.random() * 3);
                        if (rot == 0)
                            this.rotHor(rowOrCol, dirArr[dirRow], true);
                        if (rot == 1)
                            this.rotVer(rowOrCol, dirArr[dirCol], true);

                        this.rememberShuffle.push({
                            rot: rot,
                            dirRow: dirRow,
                            dirCol: dirCol,
                            dirArr: dirArr,
                            rowOrCol: rowOrCol,
                        });

                        if (i == 9)
                            setTimeout(() => {
                                this.noClick = false;
                            }, 500);
                    }, this.speedShuffle * i);
                }
            },
            doCube: function () {
                if (this.noClick || this.rememberShuffle.length == 0)
                    return;
                let auto = this.rememberShuffle;
                this.noClick = true;
                for (let i = auto.length - 1, j = 0; i >= 0; i--, j++) {

                    setTimeout(() => {
                        if (auto[i].dirRow == 0)
                            auto[i].dirRow = 1;
                        else
                            auto[i].dirRow = 0;

                        if (auto[i].dirCol == 2)
                            auto[i].dirCol = 3;
                        else
                            auto[i].dirCol = 2;

                        if (auto[i].rot == 0)
                            this.rotHor(auto[i].rowOrCol, auto[i].dirArr[auto[i].dirRow], true);
                        if (auto[i].rot == 1)
                            this.rotVer(auto[i].rowOrCol, auto[i].dirArr[auto[i].dirCol], true);
                        if (j == auto.length - 1)
                            setTimeout(() => {
                                this.noClick = false;
                            }, 500);
                    }, this.speedAuto * j);
                }

                this.rememberShuffle = [];
            },
            rotHor: function (row, direction, auto) {
                if (!auto && this.noClick)
                    return;

                if (auto != true) {
                    let dirArr = ['left', 'right', 'up', 'down'];
                    let dir = 0;
                    if (direction == 'left')
                        dir = 0;
                    else
                        dir = 1;
                    this.rememberShuffle.push({
                        rot: 0,
                        dirRow: dir,
                        dirCol: null,
                        dirArr: dirArr,
                        rowOrCol: row,
                    });
                }

                let start = row * 3;

                let j = 0;
                let allFace = [this.cube.frontFace, this.cube.rightFace, this.cube.backFace, this.cube.leftFace];

                this.changed = false;
                setTimeout(() => {
                    this.changed = true;
                }, 0);
                let temp = ['', '', '', '', '', '', '', '', '', '', '', ''];
                let tempIndex = 0;
                for (let i = start; i < start + 3 && j < allFace.length; i++) {
                    temp[tempIndex++] = allFace[j][i];
                    if (i == start + 3 - 1) {
                        j++;
                        i = start - 1;
                    }
                }
                if (direction == 'right') {
                    j = 1;
                    tempIndex = 0;
                    for (let i = start; i < start + 3 && j < allFace.length; i++) {
                        allFace[j][i] = temp[tempIndex++];
                        if (i == start + 3 - 1) {
                            j++;
                            if (j == 1)
                                break;
                            if (j == allFace.length)
                                j = 0;
                            i = start - 1;
                        }
                    }
                    if (row == 0)
                        this.rotClock('top', 1);
                    else if (row == 2)
                        this.rotClock('bot', 0);

                } else {
                    j = allFace.length - 1;
                    tempIndex = 0;
                    for (let i = start; i < start + 3 && j < allFace.length; i++) {
                        allFace[j][i] = temp[tempIndex++];
                        if (i == start + 3 - 1) {
                            j++;
                            if (j == 3)
                                break;
                            if (j == allFace.length)
                                j = 0;
                            i = start - 1;
                        }
                    }
                    if (row == 0)
                        this.rotClock('top', 0);
                    else if (row == 2)
                        this.rotClock('bot', 1);
                }
            },
            rotVer: function (col, direction, auto) {
                if (!auto && this.noClick)
                    return;

                if (auto != true) {
                    let dirArr = ['left', 'right', 'up', 'down'];
                    let dir = 0;
                    if (direction == 'up')
                        dir = 2;
                    else
                        dir = 3;
                    this.rememberShuffle.push({
                        rot: 1,
                        dirRow: null,
                        dirCol: dir,
                        dirArr: dirArr,
                        rowOrCol: col,
                    });
                }

                let start = 0;
                start = col;

                let j = 0;
                let allFace = [this.mainFront, this.cube.facciaBottom, this.mainBack, this.cube.facciaTop];

                this.changed = false;
                let temp = ['', '', '', '', '', '', '', '', '', '', '', ''];
                let tempIndex = 0;
                let cont = 0;
                for (let i = start; i < start + 3 && j < allFace.length; i) {

                    if (j == 2)
                        i = 2 - start;
                    else
                        i = start;

                    temp[tempIndex++] = allFace[j][i + 3 * cont];
                    cont++;
                    if (cont == 3) {
                        j++;
                        cont = 0;
                    }
                }
                if (direction == 'down') {
                    let tempBack = 2;
                    tempIndex = 0;
                    j = 1;
                    cont = 0;
                    for (let i = start; i < start + 3 && j < allFace.length; i) {
                        if (j == 2)
                            i = 2 - start;
                        else
                            i = start;

                        if (j == 2 || j == 3) {
                            if (tempBack == 2 && (j == 2 || j == 3)) {
                                tempBack += tempIndex;
                            }
                            allFace[j][i + 3 * cont] = temp[tempBack--];
                            tempIndex++;
                        } else
                            allFace[j][i + 3 * cont] = temp[tempIndex++];
                        cont++;
                        if (cont == 3) {
                            j++;
                            if (j == 1)
                                break;
                            if (j == allFace.length)
                                j = 0;
                            cont = 0;
                        }
                    }

                    if (col == 0)
                        this.rotClock('left', 0);
                    if (col == 2)
                        this.rotClock('right', 1);

                } else if (direction == 'up') {
                    let tempBack = 2;
                    let tempOneTime = false;
                    tempIndex = 0;
                    j = allFace.length - 1;
                    cont = 0;
                    for (let i = start; i < start + 3 && j < allFace.length; i) {
                        if (j == 2) {
                            i = 2 - start;
                            if (!tempOneTime)
                                tempBack = 2;
                            tempOneTime = true;
                        } else
                            i = start;

                        if (j == 2 || j == 1) {
                            if (tempBack == 2 && j == 2) {
                                tempBack += tempIndex;
                            } else if (tempBack == 2 && j == 1) {
                                tempBack += tempIndex;
                            }

                            allFace[j][i + 3 * cont] = temp[tempBack--];
                            tempIndex++;
                        } else
                            allFace[j][i + 3 * cont] = temp[tempIndex++];
                        cont++;
                        if (cont == 3) {
                            j++;
                            if (j == 3)
                                break;
                            if (j == allFace.length)
                                j = 0;
                            cont = 0;
                        }
                    }

                    if (col == 0)
                        this.rotClock('left', 1);
                    if (col == 2)
                        this.rotClock('right', 0);
                }

                setTimeout(() => {
                    this.changed = true;
                }, 0);
            },
            rotClock: function (dir, anticlock) {
                let temp2 = ['', '', '', '', '', '', '', '', ''];
                let tempIndex2 = 0;
                let faceSelected = this.selectFace(dir);

                if (anticlock == 1)
                    for (let i = 0; i < 9; i++)
                        temp2[i] = faceSelected[i];
                else
                    for (let j = 0, i = 8; j < 9; j++, i--)
                        temp2[j] = faceSelected[i];

                let cont = 0;
                for (let i = 0; i < 9; i++) {
                    if (i == 0) {
                        tempIndex2 = 2;
                        cont = 0;
                    }
                    if (i == 3) {
                        tempIndex2 = 1;
                        cont = 0;
                    }
                    if (i == 6) {
                        tempIndex2 = 0;
                        cont = 0;
                    }

                    faceSelected[i] = temp2[tempIndex2 + 3 * cont++];
                }
            },
            selectFace: function (dir) {
                let face;
                if (dir == 'top')
                    face = this.cube.facciaTop;
                if (dir == 'bot')
                    face = this.cube.facciaBottom;
                if (dir == 'left')
                    face = this.mainLeft;
                if (dir == 'right')
                    face = this.mainRight;
                return face;
            },
        },
        created: function () {
            this.mainFront = this.cube.frontFace;
            this.mainBack = this.cube.backFace;
            this.mainLeft = this.cube.leftFace;
            this.mainRight = this.cube.rightFace;
        },
        updated: function () {
            let cube = document.getElementById('cube');
            setTimeout(() => {
                cube = document.getElementById('cube');
                cube.style.transform = `rotateY(${this.rotY}deg) rotateX(${this.rotX}deg)`;
            }, 0);
        },
    }
);