const rs100Color = 0x8fb9c1;
const rs50Color = 0x42e8f4;
const rs20Color = 0xaf2853;
const rs10Color = 0xa35c10;
const rs5Color = 0x25d1ae;
const rsCoinColor = 0x707a77;
const rsCoinWriteColor = 0x555b5a;
var tenderWidth;
var tenderHeight;
var fontCurrency;
var fontBootStrap;
var fontSpecific;
var fontGeneral;
var tenders;
var boardWidth
var boardHeight
var board;
var currentRotationBoard;
var boardCurrentSpeed;
var boardAcceleration;
var coinRadius;
var rotatedOnce;
var currentGame;
var boxes;
var game1CheckBox;
var game2CheckBox;
var game3CheckBox;
var displayingNow;
var currentDisp;
var hbNow;
var prevGame;

// helper functions
function deg2Rad(value){
	return (3.14159265359 / 180) * parseFloat(value);
}
// -----end of helper functions------------------------

function initialiseVariables(){
	fontCurrency = undefined;
	fontBootStrap = undefined;
	fontGeneral = undefined;
	tenderWidth = 2;
	tenderHeight = 1;
	tenders = {};
	boardWidth = 7;
	boardHeight = 5;
	board = undefined;
	coinRadius = 0.4;
	game1CheckBox = "Activity 1";
	game2CheckBox = "Activity 2";
	game3CheckBox = "Activity 3";
	boxes = undefined;
}

function addFonts(pathToFont){
	loader = new THREE.FontLoader();
	let textureLoader = new THREE.TextureLoader();
	textureLoader.load('./images/1rs.png', function(response){
		tenders['coin1'] = {"img": drawCoin(response), "val": 1};
	});
	textureLoader.load('./images/2rs.png', function(response){
		tenders['coin2'] = {"img": drawCoin(response), "val": 2};
	});
	textureLoader.load('./images/5rs.png', function(response){
		tenders['tender5'] = {"img": drawTender(response), "val": 5};
	});
	textureLoader.load('./images/10rs.png', function(response){
		tenders['tender10'] = {"img": drawTender(response), "val": 10};
	});
	textureLoader.load('./images/20rs.png', function(response){
		tenders['tender20'] = {"img": drawTender(response), "val": 20};
	});
	textureLoader.load('./images/50rs.png', function(response){
		tenders['tender50'] = {"img": drawTender(response), "val": 50};
	});
	textureLoader.load('./images/100rs.png', function(response){
		tenders['tender100'] = {"img": drawTender(response), "val": 100};
	});
	textureLoader.load('./images/50p.png', function(response){
		tenders['coin50p'] = {"img": drawCoin(response), "val": 0.50};
	});
    loader.load("./fonts/optimer.json", function(response){
		fontCurrency = response;
	});

	loader.load("./fonts/gentilis.json", function (response){
		fontSpecific = response;
		fontGeneral = fontBootStrap = response;
		resetExperiment();
	})
}

function initializeOtherVariables(){
	currentRotationBoard = 0;
	boardCurrentSpeed = 0;
	boardAcceleration = 1;
	prevGame = currentGame = 1;
}

function initControls(){
	if(rotatedOnce == true) return;
	PIEaddDisplayCheckbox(game1CheckBox, true, handleCheckChange1);
	PIEaddDisplayCheckbox(game2CheckBox, false, handleCheckChange2);
	PIEaddDisplayCheckbox(game3CheckBox, false, handleCheckChange3);
	rotatedOnce = true;
}

function handleCheckChange1(){
	if(currentGame == 1){
		PIEchangeDisplayCheckbox(game1CheckBox, true);
		return;
	}
	beforeChangeGame();
	currentGame = 1;
	notifyChangeGame();
}

function handleCheckChange2(){
	if(currentGame == 2){
		PIEchangeDisplayCheckbox(game2CheckBox, true);
		return;
	}
	beforeChangeGame();
	currentGame = 2;
	notifyChangeGame();
}

function handleCheckChange3(){
	if(currentGame == 3){
		PIEchangeDisplayCheckbox(game3CheckBox, true);
		return;
	}
	beforeChangeGame();
	currentGame = 3;
	notifyChangeGame();
}

function beforeChangeGame(){
	if(currentGame == 1){
		removeBoxesGame1();
	} else if(currentGame == 2){
		removeBoxesGame2();	PIErender();
	} else if(currentGame == 3){
		removeBoxesGame3();
	}
}

function notifyChangeGame(loadScene = true){

	if(currentGame == 1){
		PIEchangeDisplayCheckbox(game1CheckBox, true);
		PIEchangeDisplayCheckbox(game2CheckBox, false);
		PIEchangeDisplayCheckbox(game3CheckBox, false);
	}
	if(currentGame == 2){
		PIEchangeDisplayCheckbox(game1CheckBox, false);
		PIEchangeDisplayCheckbox(game2CheckBox, true);
		PIEchangeDisplayCheckbox(game3CheckBox, false);
	}
	if(currentGame == 3){
		PIEchangeDisplayCheckbox(game1CheckBox, false);
		PIEchangeDisplayCheckbox(game2CheckBox, false);
		PIEchangeDisplayCheckbox(game3CheckBox, true);
	} 
	if(loadScene == true){
		loadGameScene();
	}
}

function runBootStrap(){
	board = new THREE.Group();
	let greenBoardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, 0.2);
	new THREE.TextureLoader().load('./textures/greenBoard.png', function(texture){
		let greenBoardMaterial = new THREE.MeshLambertMaterial({map: texture});
		let greenBoard = new THREE.Mesh(greenBoardGeometry, greenBoardMaterial);
		board.add(greenBoard);
		console.log("image loaded!")
		PIErender();
	});
	
	
	
	let brownBoardGeometry = new THREE.BoxGeometry(boardWidth, boardHeight, 0.01);
	new THREE.TextureLoader().load("./textures/silverTexture.png", function(texture){
		texture.wrapT = THREE.RepeatWrapping;
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.set(16, 16);
		let brownBoardMaterial = new THREE.MeshLambertMaterial({ map: texture});
		let brownBoard = new THREE.Mesh(brownBoardGeometry, brownBoardMaterial);
		brownBoard.position.z = -0.201;	
		board.add(brownBoard);
	})
	

	let sideBarGeometry =  new THREE.BoxGeometry(0.1, boardHeight + 0.2, 0.5); 
	new THREE.TextureLoader().load('./textures/silverTexture.png', function(texture){
		texture.repeat.set(8, 8);
		let sideBarMaterial = new THREE.MeshPhongMaterial({map: texture});

		let sideBarVertical1 = new THREE.Mesh(sideBarGeometry, sideBarMaterial);
		sideBarVertical1.position.x = boardWidth * 0.5;
		sideBarVertical1.position.z = 0.0;

		let sideBarVertical2 = new THREE.Mesh(sideBarGeometry, sideBarMaterial);
		sideBarVertical2.position.x = -(boardWidth * 0.5);
		sideBarVertical2.position.z = 0.0;

		let sideBarHorizontal1 = new THREE.Mesh(sideBarGeometry, sideBarMaterial);
		sideBarHorizontal1.rotation.z = deg2Rad(90);
		sideBarHorizontal1.scale.y = 1.4;
		sideBarHorizontal1.position.z = 0.0;
		sideBarHorizontal1.position.y = boardHeight * 0.5;

		let sideBarHorizontal2 = new THREE.Mesh(sideBarGeometry, sideBarMaterial);
		sideBarHorizontal2.rotation.z = deg2Rad(90);
		sideBarHorizontal2.scale.y = 1.4;
		sideBarHorizontal2.position.y = -(boardHeight * 0.5);
		sideBarHorizontal2.position.z = 0.0;

		board.add(sideBarVertical1);
		board.add(sideBarVertical2);
		board.add(sideBarHorizontal1);
		board.add(sideBarHorizontal2);
	})

	
	
	let theMoneyGameTextGeometry = new THREE.TextGeometry("The Money Game", {
		font: fontCurrency, 
		size: 0.4,
		height: 0.001,
		curveSegments: 3
	});
	new THREE.TextureLoader().load('./textures/chalkTexture.png',function(texture){
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(20, 20);
		let theMoneyGameTextMaterial = new THREE.MeshLambertMaterial({map: texture, transparent: false});
		theMoneyGameText = new THREE.Mesh(theMoneyGameTextGeometry, theMoneyGameTextMaterial);
		theMoneyGameText.position.x -= 2.2;
		theMoneyGameText.position.z = .1;
		board.add(theMoneyGameText);
		PIErender();
	});

	board.rotation.x = deg2Rad(-3);
	board.rotation.y = deg2Rad(-3);
	board.rotation.z = 0;

	PIEaddElement(board);
	PIErender();
}

function drawText(text, color, size, height, font, rotation = 0.2, basic = false){
	let geometry = new THREE.TextGeometry(text, {
		font : font,
		size : size,
		height : height,
		curveSegments : 10
	});
	geometry.computeBoundingBox();
	let textDrawen = undefined;
	if(basic == false){
		textDrawen =new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
		textDrawen.rotation.y += rotation;
	} else if(basic == true){
		textDrawen =new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:color}));
		textDrawen.rotation.y += rotation;
	}
	return textDrawen;
}

function drawCoin(texture){
	let coinGeometry = new THREE.CircleGeometry(coinRadius, 50);
	coinGeometry.computeBoundingBox();
	let coinMaterial = new THREE.MeshPhongMaterial({ map: texture});
	let coinPlate = new THREE.Mesh(coinGeometry, coinMaterial);

	return coinPlate;
}

function drawTender(texture){

	let coverGeometry = new THREE.PlaneGeometry(tenderWidth, tenderHeight);
	coverGeometry.computeBoundingBox();
	let coverMaterialOuter = new THREE.MeshBasicMaterial({map: texture});
	let coverOuter = new THREE.Mesh(coverGeometry, coverMaterialOuter);
	return coverOuter;
}

function getShades(color){
	let rMask = 0xff0000;
	let gMask = rMask >> 8;
	let bMask = gMask >> 8;

	let rShift = 16;
	let gShift = 8;
	let bShift = 0;

	let rColor = (color & rMask) >> rShift;
	let gColor = (color & gMask) >> gShift;
	let bColor = (color & bMask) >> bShift;

	let primaryLightColor;
	let primaryDarkColor;
	let secondaryLightColor;
	let secondaryDarkColor;
	let mainColor;
	mainColor = color;
	if(rColor - 10 >= 0 && gColor - 10 >= 0 && bColor - 10 >= 0){
		primaryDarkColor = (0x1 << 16) * (rColor - 10) + (0x1 << 8) * (gColor - 10) + (0x1) * (bColor - 10);
		if(rColor - 20 >= 0 && gColor - 20 >= 0 && bColor - 20 >= 0){
			secondaryDarkColor = (0x1 << 16) * (rColor - 20) + (0x1 << 8) * (gColor - 20) + (0x1) * (bColor - 20);
		} else {
			secondaryDarkColor = primaryDarkColor;
		}
	} else {
		primaryDarkColor = mainColor;
	}

	if(rColor + 10 <= 255 && gColor + 10 <= 255 && bColor + 10 <= 255){
		primaryLightColor = (0x1 << 16) * (rColor + 10) + (0x1 << 8) * (gColor + 10) + (0x1) * (bColor + 10);
		if(rColor + 20 <= 255 && gColor + 20 <= 255 && bColor + 20 <= 255){
			secondaryLightColor = (0x1 << 16) * (rColor + 20) + (0x1 << 8) * (gColor + 20) + (0x1) * (bColor + 20);
		} else {
			secondaryLightColor = primaryLightColor;
		}
	} else {
		primaryLightColor = mainColor;
	}	
	shades = {"mainColor": mainColor,
			"primaryLightColor": primaryLightColor,
			"secondaryLightColor": secondaryLightColor,
			"primaryDarkColor": primaryDarkColor,
			"secondaryDarkColor": secondaryDarkColor
		}

	return shades;
}


function getRGB(color){
	let rMask = 0xff0000;
	let gMask = rMask >> 8;
	let bMask = gMask >> 8;

	let rShift = 16;
	let gShift = 8;
	let bShift = 0;

	let rColor = (color & rMask) >> rShift;
	let gColor = (color & gMask) >> gShift;
	let bColor = (color & bMask) >> bShift;
	return {"r": rColor, "g": gColor, "b": bColor};
}

function rotateBoard(){
	board.rotation.y = deg2Rad(boardCurrentSpeed + 0.5 * boardAcceleration);
	boardCurrentSpeed = boardCurrentSpeed + boardAcceleration;
	if(board.rotation.y >= deg2Rad(180)){
		board.rotation.y = deg2Rad(180);
		boardAcceleration = 0;
		boardCurrentSpeed = 0;
		initControls();
		document.addEventListener('mousemove', onDocumentMouseHover, false );
		document.addEventListener('mousedown', onDocumentMouseDown, false);
		loadGameScene();
	}
	PIErender();
}

var valuesGame1 = {
	106: {
		"tender100": 1,
		"tender5": 1,
		"coin1": 1
	},
	110: {
		"tender100": 1,
		"tender10": 1
	},
	73: {
		"tender50": 1,
		"tender20": 1,
		"coin2": 1,
		"coin1": 1
	}, 
	59.5: {
		"tender50": 1,
		"tender5": 1,
		"coin2": 2,
		"coin50p": 1
	},
	30: {
		"tender20": 1,
		"tender10": 1
	},
	90: {
		"tender50": 1,
		"tender20": 2
	}
}

function padWithSpace(prefix, value, left){
	let finalNumber = prefix + "" + value + "";
	let valueInt = parseInt(value);
	let valueInt2 = parseInt(value);
	let count = 0;
	while(valueInt > 0){
		count+=1;
		valueInt= parseInt(valueInt/10);
	}
	let toAdd = left - count;
	if(value - valueInt2 != 0 && valueInt2 == 0){
		toAdd = 2;
	}
	if(toAdd != 0){
		
		// console.log("For: " + value + " to Add: {" + toAdd + "}");
		let stringToAdd = "";
		for(let i = 0; i < toAdd; ++i){
			stringToAdd += "  ";
		}
		finalNumber = stringToAdd + finalNumber;
	}
	return finalNumber;
}

var boxIndexMap = [106, 110, 73, 59.5, 30, 90];
function getTextGame1(value){
	let group = new THREE.Group();
	group.position.z = 1.1;
	let eqlSign = drawText("=", 0x121212, 0.25, 0.001, fontGeneral, 0);
	eqlSign.position.x = -1.3;
	eqlSign.position.y = 0.8;
	group.add(eqlSign);
	downBy = 0.0;
	for(key in valuesGame1[value]){
		let tndr = tenders[key]["img"].clone();
		let temp = tenders[key]['val'] * valuesGame1[value][key];
		if(temp - parseInt(temp) != 0){
			temp = temp.toFixed(2);
		}
		let times = drawText("x"+valuesGame1[value][key] + "= Rs." + padWithSpace(" ", temp, 3), 0x121212, 0.16, 0.001, fontGeneral, 0.0, true);
		tndr.position.set(-0.3, 1.3 - downBy, 1);
		times.position.set(0.2, 1.3 - downBy - 0.05, 1);
		tndr.scale.x = 0.4;
		tndr.scale.y = 0.4;
		group.add(tndr);
		group.add(times);
		downBy += 0.45;
	}
	downBy = downBy - 0.10;
	let bxGm = new THREE.PlaneGeometry(3, 0.01);
	let bxMt = new THREE.MeshBasicMaterial({color: 0x121212});
	let bx = new THREE.Mesh(bxGm, bxMt);
	bx.position.x = 0;
	bx.position.y = 1.3 - downBy;
	if(value - parseInt(value) != 0){
		value = value.toFixed(2);
	}
	let ttl = drawText("Rs. " + padWithSpace(" ", value, 3), 0x121212, 0.15, 0.001, fontGeneral, 0.0, true);
	ttl.position.x = 0.56;
	ttl.position.y = 1.3 - downBy - 0.15;
	ttl.position.z = 1;
	group.add(bx);
	group.add(ttl);
	return group;
}

function drawBoxGame1(value){
	if(value - parseInt(value) != 0){
		value = value.toFixed(2);
	}
	let txt = drawText("Rs." + value, 0xcdcdcd, 0.20, 0.1, fontGeneral, 0.0);
	txt.rotation.y = deg2Rad(4);
	txt.position.z += 0.1
	let boxGeometry = new THREE.PlaneGeometry(1, 1);
	boxGeometry.computeBoundingBox();
	let boxMaterial = new THREE.MeshLambertMaterial({color: 0x333333, transparent: true});
	boxMaterial.opacity = 0.2;
	let box = new THREE.Mesh(boxGeometry, boxMaterial);

	let bbText = txt.geometry.boundingBox.clone();
	let bbBox = box.geometry.boundingBox.clone();

	let textCenterX = (bbText.max.x + bbText.min.x) / 2;
	let textCenterY = (bbText.max.y + bbText.min.y) / 2;

	let boxCenterX = (bbBox.max.x + bbBox.min.x) / 2;
	let boxCenterY = (bbBox.max.y + bbBox.min.y) / 2;

	txt.translateX(boxCenterX - textCenterX);
	txt.translateY(boxCenterY - textCenterY);

	let group = new THREE.Group();
	group.add(box);
	group.add(txt);

	return group;
}

var hoverOverText;
var hoverTextsGame1;
var boxGame1;
var boxTriGame1;

function addBoxesGame1(){
	hoverOverText = drawText("Hover Over a Box to see how to make that sum of money?", 0xedb84e, 0.15, 0.01, fontSpecific, 0.0, true);
	hoverOverText.position.set(-2.5, 1.9, 0.15);
	PIEaddElement(hoverOverText); 
	if(boxes == undefined || boxes.length != 6 || hoverTextsGame1 == undefined || hoverTextsGame1.length != 6 || boxGame1 == undefined || boxTriGame1 == undefined){
		bx106 = drawBoxGame1(106);
		bx110 = drawBoxGame1(110);
		bx73 = drawBoxGame1(73);
		bx59_5 = drawBoxGame1(59.5);
		bx30 = drawBoxGame1(30);
		bx90 = drawBoxGame1(90);
		
		bx106.position.set(-1.5, 1., 0.3);
		bx110.position.set(0, 1.0, 0.3);
		bx73.position.set(1.5, 1.0, 0.3);
		bx59_5.position.set(-1.5, -1.0, 0.3);
		bx30.position.set(0, -1.0, 0.3);
		bx90.position.set(1.5, -1.0, 0.3);

		boxes =  [];
		boxes.push(bx106);
		boxes.push(bx110);
		boxes.push(bx73);
		boxes.push(bx59_5);	
		boxes.push(bx30);
		boxes.push(bx90);

		hoverTextsGame1 = [];
		for(let i = 0; i < 6; ++i){
			hoverTextsGame1.push(getTextGame1(boxIndexMap[i]));
		}

		let boxGeometry = new THREE.PlaneGeometry(4, 2.5);
		let boxMaterial = new THREE.MeshBasicMaterial({color: 0xdfdfdf, transparent: true});
		let triGeometry = new THREE.Geometry();
		triGeometry.vertices.push(new THREE.Vector3(-1, 0, 0),
								  new THREE.Vector3(1, 0, 0),
								  new THREE.Vector3(0, 1, 0));
		triGeometry.faces.push(new THREE.Face3(0, 1, 2));
		triGeometry.computeBoundingBox();
		boxMaterial.opacity = 0.989;
		boxGame1 = new THREE.Mesh(boxGeometry, boxMaterial);
		boxTriGame1 = new THREE.Mesh(triGeometry, boxMaterial);
		boxTriGame1.scale.x = 0.2;
		boxTriGame1.scale.y = 0.2;
		boxGame1.position.z = 1;
	}
	for(let bxc = 0; bxc < boxes.length; ++bxc){
		if(bxc < 3){
			PIEaddElement(boxes[bxc]);
		} else{
			PIEaddElement(boxes[bxc], true);
		}
	}
	PIErender();
}

function removeBoxesGame1(){
	if(hoverOverText != undefined){
		PIEremoveElement(hoverOverText);
	}
	if(boxes == undefined || boxes.length == 0) return;
	else {
		for(let bxc = 0; bxc < boxes.length; ++bxc){
			PIEremoveElement(boxes[bxc]);
		}
	}
	hbNow = null;
}

function removeBoxesGame2(){
	let counter = 0;
	for( let td in tenders ){
		PIEremoveElement(tenders[td]['img']);
		PIEremoveElement(buttonsGame2[counter]);
		PIEremoveElement(buttonsGame2[counter + 8]);
		counter+=1;
	}
	PIEremoveElement(seperator);
	PIEremoveElement(totalBox);
	totalSum = 0;
	for(let i = 0; i < eachValueGame2.length; ++i){
		eachValueGame2[i] = 0;
	}
	for(let i = 0; i < indiCountGame2.length; ++i){
		PIEremoveElement(indiCountGame2[i]);
	}
	PIEremoveElement(headTextGame2);
	headTextGame2 = null;
}

var hasBoxesGame3;
function removeBoxesGame3(){
	bendBoardBool = true;
	if(hasBoxesGame3 == false) return;
	PIEremoveElement(pointLight);
	for(let i = 0; i < priceVars.length; ++i){
		PIEremoveElement(priceVars[i]);
	}
	for(let i = 0; i < shopItems.length; ++i){
		PIEremoveElement(shopItems[i]);
		PIEremoveElement(itembbsGame3[i]);
	}
	for(let i = 0; i < yourItemsGame3Obj.length; ++i){
		PIEremoveElement(yourItemsGame3Obj[i][0]);
		PIEremoveElement(yourItemsGame3Obj[i][1]);
		PIEremoveElement(yourItemsGame3Obj[i][2]);
	}
	if(billplate != undefined){
		PIEremoveElement(billplate);
	}
	PIEremoveElement(doneButton);
	removeInvoice();
	PIEremoveElement(clickOnItemText);
	hasBoxesGame3 = false;
}


function handleHover(boxValue, removeBox = false){
	if(removeBox == true){
		if(hbNow != null){
			PIEremoveElement(hbNow);
			PIErender();
		}
		hbNow = null;
		displayingNow = false;
		currentDisp = -1;
	} else {
		if(displayingNow == true && boxValue == currentDisp){
			return;
		}
		
		hbNow = hoverBox(4, 3, boxValue);
		PIEaddElement(hbNow);
		displayingNow = true;
		currentDisp = boxValue;
		PIErender();
	}
}


function handleClickGame2(intersectedBox){
	let toUse = (intersectedBox % 8);
	if(intersectedBox >= 8){
		if(eachValueGame2[toUse] == 0){
			return;
		} else {
			eachValueGame2[toUse] -= 1;
			updateTotal(-1, toUse);
		}
	} else if(intersectedBox < 8){
		if(eachValueGame2[toUse] == 5){
			return;
		} else {
			eachValueGame2[toUse] += 1;
			updateTotal(1, toUse);
		}
	}
}

function updateTotal(addOrSub, index){
	// if(totalBox == null) return;
	let amount = valueIndexMapGame2[index];
	PIEremoveElement(totalBox);
	PIEremoveElement(indiCountGame2[index]);

	totalSum = totalSum + addOrSub * amount;
	let dispSum = totalSum;
	if(totalSum - parseInt(totalSum) != 0){
		dispSum = totalSum.toFixed(2);
	}
	totalBox = drawText("total = Rs. " + dispSum, 0xffffff, 0.15, 0.001, fontGeneral, 0, true);

	let amountIndi = drawText(eachValueGame2[index], 0xffffff, 0.20, 0.001, fontGeneral, 0.0, true);
	
	amountIndi.position.set(positionsGame2[index].x, positionsGame2[index].y, positionsGame2[index].z);
	indiCountGame2[index] = amountIndi;
	PIEaddElement(indiCountGame2[index]);
	
	totalBox.position.set(positionsGame2[8].x, positionsGame2[8].y, positionsGame2[8].z);
	PIEaddElement(totalBox);
}

function hoverBox(length, height, boxValue){
	
	let group = new THREE.Group();
	let txt = hoverTextsGame1[boxValue];
	group.add(txt);
	group.add(boxGame1);
	group.add(boxTriGame1);

	if(boxValue == 0){
		boxTriGame1.rotation.z = 0;
		boxTriGame1.position.set(-1.25, 1.65, 1);
		boxGame1.position.y = 0.4;
		group.position.y = -1.;
	} else if(boxValue == 1) {
		boxTriGame1.rotation.z = 0;
		boxTriGame1.position.set(-0.2, 1.65, 1);
		boxGame1.position.y = 0.4;
		group.position.y = -1.;
	} else if(boxValue == 2){
		boxTriGame1.rotation.z = 0;
		boxTriGame1.position.set(1.2, 1.65, 1);
		boxGame1.position.y = 0.4;
		group.position.y = -1.;
	} else if(boxValue == 3){
		txt.position.y = -0.9;
		boxTriGame1.rotation.z = deg2Rad(180);
		boxTriGame1.position.set(-1.2, -1.65, 1);
		boxGame1.position.y = -0.4;
		group.position.y = +1.;
	} else if(boxValue == 4) {
		txt.position.y = -1.7;
		boxTriGame1.rotation.z = deg2Rad(180);
		boxTriGame1.position.set(0.2, -1.65, 1);
		boxGame1.position.y = -0.4;
		group.position.y = +1.;
	} else if(boxValue == 5){
		txt.position.y = -1.7;
		boxTriGame1.rotation.z = deg2Rad(180);
		boxTriGame1.position.set(1.25, -1.65, 1);
		boxGame1.position.y = -0.4;
		group.position.y = +1.;
	}
	return group;
}

function loadGameScene(){
	if(currentGame == 1){
		displayingNow = false;
		currentDisp = -1;
		hbNow = null;
		addBoxesGame1();
	} else if(currentGame == 2){
		// console.log(currentGame);
		addGame2();
	} else if(currentGame == 3){
		// console.log(currentGame);
		addGame3();
	}
}

function buttonStyle(value, blacked = false){
	let circleGeometry = new THREE.CircleGeometry(0.1, 40);
	circleGeometry.computeBoundingBox();
	let circleMaterial;
	if(blacked == false){
		circleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true});
	} else {
		circleMaterial = new THREE.MeshBasicMaterial({color: 0x333333, transparent: true});
	}
	circleMaterial.opacity = 0.6;
	let circle = new THREE.Mesh(circleGeometry, circleMaterial);
	let text = drawText(value, 0xffffff, 0.10, 0.001, fontCurrency, 0.0, true);
	let group = new THREE.Group();

	let bbText = text.geometry.boundingBox.clone();
	let bbBox = circle.geometry.boundingBox.clone();

	let textCenterX = (bbText.max.x + bbText.min.x) / 2;
	let textCenterY = (bbText.max.y + bbText.min.y) / 2;

	let boxCenterX = (bbBox.max.x + bbBox.min.x) / 2;
	let boxCenterY = (bbBox.max.y + bbBox.min.y) / 2;

	text.translateX(boxCenterX - textCenterX);
	text.translateY(boxCenterY - textCenterY);

	group.add(circle);
	group.add(text);
	group.position.z = 1;

	return group;
}

var buttonsGame2 = undefined;
var seperator = undefined;
var totalSum = 0;
var totalBox = undefined;
var indiCountGame2 = undefined;
const valueIndexMapGame2 = [100, 50, 20, 10, 5, 2, 1, 0.50];
var eachValueGame2 = [0, 0, 0, 0, 0, 0, 0, 0];
var positionsGame2 = undefined;
let headTextGame2;
function addGame2(){
	if(buttonsGame2 == undefined || buttonsGame2.length != 16){
		let plus = buttonStyle("+");
		let sub = buttonStyle("-");

		buttonsGame2 = [];
		for(let i = 0; i < 8; ++i){
			buttonsGame2.push(plus.clone());
		}
		for(let i = 0; i < 8; ++i){
			buttonsGame2.push(sub.clone());
		}
		
	}

	let downBy = 0;
	indiCountGame2 = [];
	positionsGame2 = [];
	let tendersToShow = ['tender100', 'tender50', 'tender20', 'tender10', 'tender5', 'coin2', 'coin1', 'coin50p']
	for(let counter = 0; counter < tendersToShow.length; ++counter){
		let td = tendersToShow[counter];
		if(counter >= 4){
			tenders[td]['img'].position.set(0.7, 1.7 - downBy - 0.3, 1);
			if(td.startsWith("tender") == true){
				tenders[td]['img'].scale.set(0.6, 0.6, 1);	
			} else {
				tenders[td]['img'].scale.set(0.7, 0.7, 1);	
			}
			buttonsGame2[counter].position.set(2.0, 1.7 - downBy - 0.3, 1);
			buttonsGame2[8 + counter].position.set(2.5, 1.7 - downBy - 0.3, 1);
			let amount = drawText(eachValueGame2[counter], 0xffffff, 0.2, 0.001, fontGeneral, 0.0, true);
			let ps = new THREE.Vector3(2.2, 1.7 - downBy - 0.4, 1);
			positionsGame2.push(ps);
			amount.position.set(2.2, 1.7 - downBy - 0.40, 1);
			PIEaddElement(amount);
			indiCountGame2.push(amount);
			downBy += 0.8;
		} else{
			tenders[td]['img'].position.set(-2, 1.7 - downBy - 0.3, 1);
			tenders[td]['img'].scale.set(0.65, 0.65, 1);
			buttonsGame2[counter].position.set(-1.0, 1.7 - downBy - 0.3, 1);
			buttonsGame2[8 + counter].position.set(-0.5, 1.7 - downBy - 0.3, 1);
			let amount = drawText(eachValueGame2[counter], 0xffffff, 0.2, 0.001, fontGeneral, 0.0, true);
			let ps = new THREE.Vector3(-.82, 1.7 - downBy - 0.4, 1);
			positionsGame2.push(ps);			
			amount.position.set(-.82, 1.7 - downBy - 0.40, 1);
			PIEaddElement(amount);
			indiCountGame2.push(amount);
			downBy += 0.8;
		}
		
		PIEaddElement(tenders[td]["img"]);
		PIEaddElement(buttonsGame2[counter]);
		PIEaddElement(buttonsGame2[8+counter]);
		if(counter == 3){
			downBy = 0;
		}
	}

	let seperatorGeometry = new THREE.PlaneGeometry(6, 0.01);
	let seperatorMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	seperator = new THREE.Mesh(seperatorGeometry, seperatorMaterial);
	seperator.position.set(0, 1.5 - downBy, 1);
	totalBox = drawText("total = Rs. " + totalSum, 0xffffff, 0.15, 0.001, fontGeneral, 0, true);
	downBy += 0.55;
	let headTextGame2_1 = drawText("See how the notes and coins add up to make amount!", 0xedb84e, 0.15, 0.001, fontSpecific, 0.0, true);
	headTextGame2_1.position.set(-2.2, 2.1, 0.15);

	let headTextGame2_2 = drawText("(Click +/- to add/remove)", 0xedb84e, 0.11, 0.001, fontSpecific, 0.0, true);
	headTextGame2_2.position.set(-1.0, 1.93, 0.15);

	headTextGame2  = new THREE.Group();
	headTextGame2.add(headTextGame2_1);
	headTextGame2.add(headTextGame2_2);
	PIEaddElement(headTextGame2);
	

	let ps = new THREE.Vector3(-0.3, 1.7 - downBy + 0.1, 1);
	positionsGame2.push(ps);
	totalBox.position.set(-0.3, 1.7 - downBy + 0.1, 1)	
	PIEaddElement(totalBox);
	PIEaddElement(seperator);
	PIErender();
}

var shopItems;
var shop;
var bendBoardBool;
var curretRotation;
var priceVars;
var billplate;
var doneButton;

var priceMap = {
	0: 10,
	1: 10,
	2: 5, 
	3: 3.50,
	4: 0.50
} 

var yourItemsGame3Obj;
var yourItemsGame3Count;
var itembbsGame3;

function initControlsGame3(){
	bendBoardBool = true;
	shop = undefined;
	shopItems = undefined;
	priceVars = undefined;
	billplate = undefined;
	itembbsGame3 = undefined;
	currentRotationBoard = board.rotation.x;
	yourItemsGame3Obj = undefined;
	yourItemsGame3Count = [0, 0, 0, 0, 0];
}

function drawItemObject(value, objName, position){
	let textValue = drawText("x " + value, 0x121212, 0.1, 0.001, fontSpecific, 0.0, true);
	let textObject = drawText(objName, 0x121212, 0.1, 0.001, fontSpecific, 0.0, true);
	let minButton = buttonStyle("-", true);
	textObject.position.set(position[0], position[1], position[2]);
	textValue.position.set(position[0] + 0.6, position[1], position[2]);
	minButton.position.set(position[0] + 1.2, position[1] + 0.05, position[2]);
	return [textObject, textValue, minButton, position];
}

function getRestructuredBoundingBox(obj, scalex = 1.8, scaley = 1.5){
	let bb = new THREE.Box3().setFromObject(obj);
	let Xwidth = bb.max.x - bb.min.x;
	let Ywidth = bb.max.y - bb.min.y;
	let Zwidth = bb.max.z - bb.min.z;
	let incXWidth = Xwidth * scalex;
	let incYWidth = Ywidth * scaley;

	let boxFromGm = new THREE.BoxGeometry(incXWidth, incYWidth, Zwidth);
	let boxMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true});
	boxMaterial.opacity = 0.01;
	let bx = new THREE.Mesh(boxFromGm, boxMaterial);
	let  bbNew = new THREE.Box3().setFromObject(bx);

	let centerXPrev = (bb.max.x + bb.min.x)/2;
	let centerYPrev = (bb.max.y + bb.min.y)/2;
	let centerZPrev = (bb.max.z + bb.min.z)/2;

	let centerXNew = (bbNew.max.x + bbNew.min.x)/2;
	let centerYNew = (bbNew.max.y + bbNew.min.y)/2;
	let centerZNew = (bbNew.max.z + bbNew.min.z)/2;

	bx.translateX(centerXPrev - centerXNew);
	bx.translateY(centerYPrev - centerYNew);
	bx.translateZ(centerZPrev - centerZNew);

	return bx;
}

var pointLight;
var clickOnItemText;
function drawShop(){
	if(shopItems == undefined || shopItems.length == 5){
		let ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
		let ballMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
		let ball = new THREE.Mesh(ballGeometry, ballMaterial);
		ball.castShadow = true;
		ball.position.set(-1.5, 1.0, -0.2);

		let topGeometry = new THREE.CylinderGeometry(0.03, 0.2, 0.5, 20, 3, false);
		let topPinGeometry = new THREE.ConeGeometry(0.01, 0.1, 10, 3, false);
		let topTopGeometry = new THREE.CylinderGeometry(0.2, 0.16, 0.1, 20, 3, false);

		let topMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
		let topUpMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
		let topPinMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});

		let topUp = new THREE.Mesh(topGeometry, topMaterial);
		let topPin = new THREE.Mesh(topPinGeometry, topPinMaterial);
		let topTop = new THREE.Mesh(topTopGeometry, topUpMaterial);

		topTop.position.y = -0.3;
		let top = new THREE.Group();
		topPin.position.y = .3;
		top.add(topUp);
		top.add(topPin);
		top.add(topTop);
		top.position.set(.0, 1.0, -0.2);
		top.rotation.z = deg2Rad(200);
		top.rotation.x = deg2Rad(-40);

		let bbBoxTopGame3 = new THREE.BoundingBoxHelper(top, 0xffffff);
		// tpbd.update();
		// top.add(tpbd);

		
		let pencilGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8, 1, false);
		let pencilTipGeometry = new THREE.CylinderGeometry(0.1, 0.07, 0.1, 8, 1, false);
		let pencilPinGeometry = new THREE.ConeGeometry(0.05, 0.1, 8, 1, false);

		let pencilMaterial = new THREE.MeshPhongMaterial({color: 0xce3f35});
		let pencilTipMaterial = new THREE.MeshLambertMaterial({color: 0xb55d2b});
		let pencilPinMaterial = new THREE.MeshPhongMaterial({color: 0x000000});

		let pencilTop = new THREE.Mesh(pencilGeometry, pencilMaterial);
		let pencilTip = new THREE.Mesh(pencilTipGeometry, pencilTipMaterial);
		let pencilPin = new THREE.Mesh(pencilPinGeometry, pencilPinMaterial);
		let pencil = new THREE.Group();

		pencil.add(pencilTop);
		pencil.add(pencilTip);
		pencil.add(pencilPin);
		pencilPin.rotation.z = deg2Rad(180);
		pencilTip.position.y = -0.45;
		pencilPin.position.y = -0.55;
		pencil.position.set(1.5, 1.0, -0.2);

		pencil.rotation.x = deg2Rad(-50);
		pencil.rotation.z = deg2Rad(-30);

		let bbBoxPencilGame3 = new THREE.Box3().setFromObject(pencil);
		let BoxGeometry = new THREE.BoxGeometry();
		console.log(bbBoxPencilGame3);
		// PIEaddElement(bbBoxPencilGame3.box.min);

		let eraserGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.4);
		let eraserMaterial = new THREE.MeshPhongMaterial({color: 0xdfdfdf});
		let eraser = new THREE.Mesh(eraserGeometry, eraserMaterial);

		eraser.rotation.y = deg2Rad(20);
		eraser.rotation.x = deg2Rad(50);
		eraser.position.set(-0.5, 0.0, 1.0);

		let toffeeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 4, 1, false);
		let toffeeMaterial = new THREE.MeshPhongMaterial({color: 0x3e2fa3});
		let toffeeMid = new THREE.Mesh(toffeeGeometry, toffeeMaterial);

		let toffeeOpenGeometry = new THREE.ConeGeometry(0.1, 0.3, 10, 1, true);
		let toffeeOpen1 = new THREE.Mesh(toffeeOpenGeometry, toffeeMaterial);
		let toffeeOpen2 = toffeeOpen1.clone();

		toffeeMid.rotation.z = deg2Rad(90);
		toffeeOpen1.rotation.z = deg2Rad(90);
		toffeeOpen2.rotation.z = deg2Rad(-90);
		toffeeOpen1.position.x = 0.15;
		toffeeOpen2.position.x = -0.15;

		let toffee = new THREE.Group();
		toffee.add(toffeeMid);
		toffee.add(toffeeOpen1);
		toffee.add(toffeeOpen2);

		toffee.position.set(1.0, 0.0, 1.0);

		shopItems = [];
		shopItems.push(ball);
		shopItems.push(top);
		shopItems.push(pencil);
		shopItems.push(eraser);
		shopItems.push(toffee);

		itembbsGame3 = [];
		itembbsGame3.push(getRestructuredBoundingBox(ball, 1.8, 1.8));
		itembbsGame3.push(getRestructuredBoundingBox(top));
		itembbsGame3.push(getRestructuredBoundingBox(pencil, 1.7, 1.7));
		itembbsGame3.push(getRestructuredBoundingBox(eraser, 2, 2));
		itembbsGame3.push(getRestructuredBoundingBox(toffee, 1.8, 2.2));

		
	}

	for(let i = 0; i < shopItems.length; ++i){
		PIEaddElement(shopItems[i]);
	}

	for(let i = 0; i < itembbsGame3.length; ++i){
		PIEaddElement(itembbsGame3[i]);
	}

	priceVars = [];
	priceBall = drawText("Ball-Rs." + priceMap[0], 0xdddddd, 0.13, 0.001, fontGeneral, 0.0, true);
	priceBall.position.set(-1.7, 0.5, 0.5);

	priceTop = drawText("Top-Rs." + priceMap[1], 0xdddddd, 0.13, 0.001, fontGeneral, 0.0, true);
	priceTop.position.set(-0.2, 0.5, 0.5);

	pricePencil = drawText("Pencil-Rs." + priceMap[2], 0xdddddd, 0.13, 0.001, fontGeneral, 0.0, true);
	pricePencil.position.set(1.1, 0.5, 0.5);

	priceEraser = drawText("Eraser-Rs." + (priceMap[3]).toFixed(2), 0xdddddd, 0.13, 0.001, fontGeneral, 0.0, true);
	priceEraser.position.set(-1.0, -0.4, 1.2);

	priceCandy = drawText("Candy-Rs." + (priceMap[4]).toFixed(2), 0xdddddd, 0.13, 0.001, fontGeneral, 0.0, true);
	priceCandy.position.set(0.6, -0.4, 1.2);

	priceVars.push(priceBall);
	priceVars.push(priceTop);
	priceVars.push(pricePencil);
	priceVars.push(priceEraser);
	priceVars.push(priceCandy);

	for(let i = 0; i < priceVars.length; ++i){
		PIEaddElement(priceVars[i]);
	}

	billplateGeometry = new THREE.PlaneGeometry(1.8, 3);
	billMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true});
	billMaterial.opacity = 0.95;
	billplateCover = new THREE.Mesh(billplateGeometry, billMaterial);
	billplateCover.position.set(-2.7, .1, 2.5);

	billHeadText = drawText("Your Items", 0x121212, 0.1, 0.001, fontSpecific, 0.0, true);
	billHeadText.position.set(-3.0, 1.3, 2.6);

	billplate = new THREE.Group();
	billplate.add(billplateCover);
	billplate.add(billHeadText);
	PIEaddElement(billplate);
	
	yourItemsGame3Count = [0, 0, 0, 0, 0];
	yourItemsGame3Obj = [];

	ballItem = drawItemObject(yourItemsGame3Count[0], "Ball", [-3.32, 1.0, 2.9]);
	topItem = drawItemObject(yourItemsGame3Count[1], "Top", [-3.32, .6, 2.9]);
	pencilItem = drawItemObject(yourItemsGame3Count[2], "Pencil", [-3.32, 0.2, 2.9]);
	eraserItem = drawItemObject(yourItemsGame3Count[3], "Eraser", [-3.32, -0.2, 2.9]);
	candyItem = drawItemObject(yourItemsGame3Count[4], "Candy", [-3.32, -0.6, 2.9]);

	yourItemsGame3Obj.push(ballItem);
	yourItemsGame3Obj.push(topItem);
	yourItemsGame3Obj.push(pencilItem);
	yourItemsGame3Obj.push(eraserItem);
	yourItemsGame3Obj.push(candyItem);

	for(let i = 0; i < yourItemsGame3Obj.length; ++i){
		PIEaddElement(yourItemsGame3Obj[i][0]);
		PIEaddElement(yourItemsGame3Obj[i][1]);
		PIEaddElement(yourItemsGame3Obj[i][2]);
	}

	let doneButtonGeometry = new THREE.PlaneGeometry(1.4, 0.25, 2, 2);
	doneButtonGeometry.computeBoundingBox();
	let doneButtonMaterial = new THREE.MeshLambertMaterial({color: 0x333333});
	let doneButtonCover = new THREE.Mesh(doneButtonGeometry, doneButtonMaterial);
	doneButtonText = drawText("Done", 0xdddddd, 0.1, 0.001, fontSpecific, 0.0, true);

	let bbText = doneButtonText.geometry.boundingBox.clone();
	let bbBox = doneButtonCover.geometry.boundingBox.clone();

	let textCenterX = (bbText.max.x + bbText.min.x) / 2;
	let textCenterY = (bbText.max.y + bbText.min.y) / 2;

	let boxCenterX = (bbBox.max.x + bbBox.min.x) / 2;
	let boxCenterY = (bbBox.max.y + bbBox.min.y) / 2;

	doneButtonText.translateX(boxCenterX - textCenterX);
	doneButtonText.translateY(boxCenterY - textCenterY);

	doneButton = new THREE.Group();
	doneButton.add(doneButtonCover);
	doneButton.add(doneButtonText);
	doneButton.position.set(-2.7, -1.0, 2.6);

	PIEaddElement(doneButton);
	hasBoxesGame3 = true;

	clickOnItemText = drawText("Click on an item to add to cart.", 0xdedede, 0.15, 0.01, fontSpecific, 0.0, true);
	clickOnItemText.position.set(-1.4, 2, 1);
	PIEaddElement(clickOnItemText);
	PIErender();
}


function addGame3(){
	showingInvoice = false;
	initControlsGame3();
}

function bendBoard(inverse = false){
	let rt = -50;
	if(inverse == false && board.rotation.x > deg2Rad(rt)){
		board.rotation.x -= deg2Rad(1);
		if(board.rotation.x < deg2Rad(rt)){
			board.rotation.x = deg2Rad(rt)
			bendBoardBool = false;
			drawShop();
		}
	} else if(inverse == true && board.rotation.x < deg2Rad(-3)){
		board.rotation.x += deg2Rad(1);
		if(board.rotation.x > -3){
			board.rotation.x = deg2Rad(-3);
			bendBoardBool = false;
		}
	} 
	PIErender();
}

function handleAddItemGame3(index){
	if(yourItemsGame3Count[index] >= 10){
		return;
	}
	yourItemsGame3Count[index] += 1;
	let textValue = drawText("x " + yourItemsGame3Count[index], 0x121212, 0.1, 0.001, fontSpecific, 0.0, true);
	PIEremoveElement(yourItemsGame3Obj[index][1]);
	textValue.position.set(yourItemsGame3Obj[index][3][0] + 0.6, yourItemsGame3Obj[index][3][1], yourItemsGame3Obj[index][3][2]);
	yourItemsGame3Obj[index][1] = textValue;
	PIEaddElement(yourItemsGame3Obj[index][1]);
}

function handleRemoveItemGame3(index){
	if(yourItemsGame3Count[index] <= 0){
		return;
	}
	yourItemsGame3Count[index] -= 1;
	let textValue = drawText("x " + yourItemsGame3Count[index], 0x121212, 0.1, 0.001, fontSpecific, 0.0, true);
	PIEremoveElement(yourItemsGame3Obj[index][1]);
	textValue.position.set(yourItemsGame3Obj[index][3][0] + 0.6, yourItemsGame3Obj[index][3][1], yourItemsGame3Obj[index][3][2]);
	yourItemsGame3Obj[index][1] = textValue;
	PIEaddElement(yourItemsGame3Obj[index][1]);
}

function removeInvoice(){
	if(showingInvoice == false){
		return;
	}
	PIEremoveElement(invoice);
	PIEremoveElement(invoiceCross);
	invoice = undefined;
	invoiceCross = undefined;
	showingInvoice = false;
}

function itemForInvoice(index, nameOfItem, quantity, totalPrice, position, fontSize = 0.15){

	let indexText = drawText(index, 0x333333, fontSize, 0.001, fontSpecific, 0.0, true);
	let nameItemText = drawText(nameOfItem, 0x333333, fontSize, 0.001, fontSpecific, 0.0, true);
	let quantityText = drawText(quantity, 0x333333, fontSize, 0.001, fontSpecific, 0.0, true);
	let totalPriceText = drawText(totalPrice, 0x333333, fontSize, 0.001, fontSpecific, 0.0, true);

	indexText.position.set(position[0], position[1], position[2]);
	nameItemText.position.set(position[0] + 0.55, position[1], position[2]);
	quantityText.position.set(position[0] + 2.5, position[1], position[2]);
	totalPriceText.position.set(position[0] + 3.55, position[1], position[2]);

	let group = new THREE.Group();
	group.add(indexText);
	group.add(nameItemText);
	group.add(quantityText);
	group.add(totalPriceText);
	return group;

}

var invoice;
var showingInvoice;
var invoiceCross;
function handleShowInvoice(){
	if(showingInvoice == true){
		return;
	}
	showingInvoice = true;
	let invoiceBoxGeometry = new THREE.PlaneGeometry(5, 4, 2, 2);
	let invoiceBoxMaterial = new THREE.MeshBasicMaterial({color: 0xefc956, transparent: true});
	invoiceBoxMaterial.opacity = 1;
	let invoiceBox = new THREE.Mesh(invoiceBoxGeometry, invoiceBoxMaterial);
	invoiceBox.position.z = 3;

	invoiceCross = buttonStyle("x", true);
	invoiceCross.position.set(-2.2, 1.75, 3);

	let textInvoiceHead = drawText("Invoice", 0x333333, 0.15, 0.001, fontSpecific, 0.0, true);
	textInvoiceHead.position.set(-0.3, 1.72, 3);
	let textABCStore = drawText("ABC General Store", 0x333333, 0.08, 0.001, fontSpecific, 0.0, true);
	textABCStore.position.set(-0.4, 1.60, 3);

	let seperatorsGame3Geometry = new THREE.PlaneGeometry(4.98, 0.01, 2, 2);
	let seperatorGame3Material = new THREE.MeshBasicMaterial({color: 0x333333});
	let seperatorGame3 = new THREE.Mesh(seperatorsGame3Geometry, seperatorGame3Material);
	
	let seperatorHead = seperatorGame3.clone();
	seperatorHead.position.set(0, 1.54, 3.01);

	let seperatorHeaders = seperatorGame3.clone();
	seperatorHeaders.position.set(0, 1.14, 3.01);

	let seperatorTotal = seperatorGame3.clone();
	seperatorTotal.position.set(0, -1.5, 3.01);
	
	let seperatorVert = seperatorGame3.clone();
	seperatorVert.rotation.z = deg2Rad(90);	
	seperatorVert.scale.x = 0.7;
	seperatorVert.position.y = -0.2;
	seperatorVert.position.z = 3.01;
	let seperatorIndex = seperatorVert.clone();
	seperatorIndex.position.x = -2;
	let seperatorName = seperatorVert.clone();
	seperatorName.position.x = 0;
	let seperatorQuantity = seperatorVert.clone();
	seperatorQuantity.position.x = 1;

	let totalDisplay = drawText("Total", 0x333333, 0.15, 0.001, fontSpecific, 0.0, true);
	totalDisplay.position.set(-1, -1.8, 3.01);
	totalAmountNumeric = (priceMap[0] * yourItemsGame3Count[0] +
						priceMap[1] * yourItemsGame3Count[1] +
						priceMap[2] * yourItemsGame3Count[2] +
						priceMap[3] * yourItemsGame3Count[3] +
						priceMap[4] * yourItemsGame3Count[4]
					);
	if(totalAmountNumeric - parseInt(totalAmountNumeric) != 0){
		totalAmountNumeric = totalAmountNumeric.toFixed(2);
	}
	totalAmountText = drawText("Rs " + totalAmountNumeric, 0x333333, 0.15, 0.001, fontSpecific, 0.0, true);
	totalAmountText.position.set(1.2, -1.8, 3.01);

	let headersForItems = itemForInvoice("SNo", "Item Name", "Quantity", "Price", [-2.45, 1.3, 3.01]); 
	let itemNames = ['Ball', 'Top', 'Pencil', 'Eraser', 'Candy'];
	
	invoice = new THREE.Group();
	let downBy = 0.4;
	let currentIndex = 1;
	for(let i = 0; i < itemNames.length; ++i){
		if(yourItemsGame3Count[i] > 0){
			let ttl = yourItemsGame3Count[i] * priceMap[i];
			if(ttl - parseInt(ttl) != 0){
				ttl = ttl.toFixed(2);
			}
			let textItem = itemForInvoice(currentIndex, itemNames[i], yourItemsGame3Count[i], ttl, [-2.2, 1. - downBy, 3.01], 0.1);
			currentIndex += 1;
			invoice.add(textItem);
			downBy += 0.4;
		}
	}
	
	invoice.add(invoiceBox);
	invoice.add(invoiceCross);
	invoice.add(textInvoiceHead);
	invoice.add(textABCStore);
	invoice.add(seperatorHead);
	invoice.add(seperatorIndex);
	invoice.add(seperatorHeaders);
	invoice.add(seperatorName);
	invoice.add(seperatorQuantity);
	invoice.add(seperatorTotal);
	invoice.add(totalDisplay);
	invoice.add(totalAmountText);
	invoice.add(headersForItems);
	invoice.scale.x = 0.8;
	invoice.scale.y = 0.8;

	PIEaddElement(invoice);
}

function loadExperimentElements(){
		
	initialiseHelp();
	initialiseInfo();
	PIEsetDeveloperName("Kartik Verma");
	PIEsetExperimentTitle("The Money Game");
	rotatedOnce = false;
	PIEscene.background = new THREE.Color(0xababab);
	bulb = new THREE.PointLight(0xfff);
	bulb.position.set(0, boardHeight * 0.3, 0.0);

	PIEaddElement(bulb);
	initialiseVariables();
	PIEsetAreaOfInterest(-3, 3, 3, -3);
	addFonts();
}


function resetExperiment(){
	beforeChangeGame();
	PIEremoveElement(board);
	board = null;
	hasRun = false;
	document.removeEventListener('mousemove', onDocumentMouseHover, false );
	document.removeEventListener('mousedown', onDocumentMouseDown, false);
	PIErender();
	prevGame = currentGame = 1;	
	notifyChangeGame(false);
	initializeOtherVariables();
	runBootStrap();
}

var raycaster= new THREE.Raycaster();
var mouse = new THREE.Vector2();
function onDocumentMouseHover( event ) {
	
	PIErender();
	mouse.x = ( event.clientX / PIErenderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / PIErenderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, PIEcamera );
	
	if(currentGame == 1 && boxes != undefined){
		for(var i=0;i<boxes.length;i++){
			let objects = boxes[i];
			let intersects = raycaster.intersectObjects(objects.children);
			if ( intersects.length > 0 ) {
				handleHover(i);
				break;
			} else {
				handleHover(i, true);
			}
		}
	}
	PIErender();
}

function onDocumentMouseDown( event ) {

	PIErender();
	mouse.x = ( event.clientX / PIErenderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / PIErenderer.domElement.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, PIEcamera );
	
	if(currentGame == 2 && buttonsGame2 != undefined){
		for(var i=0;i<buttonsGame2.length;i++){
			let objects = buttonsGame2[i];
			let intersects = raycaster.intersectObjects(objects.children);
			if ( intersects.length > 0 ) {
				handleClickGame2(i);
				break;
			}
		}
	} else if(currentGame == 3 && shopItems != undefined && shopItems != []){
		let intersects;
		intersects = raycaster.intersectObjects(doneButton.children);
		
		if(intersects.length > 0){
			handleShowInvoice();
			return;
		} 

		if(showingInvoice == false){
			for(let i = 0; i < yourItemsGame3Obj.length; ++i){
				let objects = yourItemsGame3Obj[i][2];
				intersects = raycaster.intersectObjects(objects.children);
				if(intersects.length > 0){
					handleRemoveItemGame3(i);
					return;
				}
			}
		}
		
		for(let i=0;i<itembbsGame3.length;i++){
			let objects = itembbsGame3[i];
			if(objects.children.length == 0){
				intersects = raycaster.intersectObjects([objects]);
			} else {
				intersects = raycaster.intersectObjects(objects.children);
			}
			if ( intersects.length > 0 ) {
				console.log("This intersects: " + i);
				handleAddItemGame3(i);
				return;
			}
		}
		if(showingInvoice == true){
			intersects = raycaster.intersectObjects(invoiceCross.children);
			if(intersects.length > 0){
				removeInvoice();
			}
		}
	}
	PIErender();
}


function updateExperimentElements(t, dt){
    if(board != undefined){
		if(board.rotation.y < deg2Rad(180)){
			rotateBoard();
		}
	}
	if(currentGame == 3 && bendBoardBool == true){
		bendBoard();
	} else if(currentGame != 3 && bendBoardBool == true){
		bendBoard(true);
	}
}

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>The Money Game</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows maths related to money</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>The initial state is setup stage. ";
    helpContent = helpContent + "There is nothing much to do in this stage.</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>This is where all the fun happens</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>The animation starts with rotating the board.</p>";
    helpContent = helpContent + "<p>After the board is rotated three controls become visible on the User panel.";
    helpContent = helpContent + "These controls can be used to switch between the three available activities.</p>";
    helpContent = helpContent + "<h3>Important notes</h3>";
    helpContent = helpContent + "<p>In activity 1 hover over a box to see the details</p>";
    helpContent = helpContent + "<p>In activity 2 click on plus button to add that currency to total, while clicking on minus button deducts the same from total</p>";
    helpContent = helpContent + "<p>In activity 3 click on an item to add it to cart. Click the minus button on Your Item menu on left to reduce the quantity. Max quantity for each item is set to 10.</p>";
    helpContent = helpContent + "<p>*The animations are heavy and may take some time to load while switching between the activities.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows three activities about using the money as a tool for showing math operations</p>";
    infoContent = infoContent + "<h3>Activity 1</h3>";
    infoContent = infoContent + "<p>Activity 1 shows ways in which a certain amount can be build by adding the currency notes</p>";
    infoContent = infoContent + "<h3>Activity 2</h3>";
    infoContent = infoContent + "<p>Activity 2 allows you to see how adding various currency note values can lead to different amounts. The max available count for each type of currency note is 5 in this case</p>";
   	infoContent = infoContent + "<h3>Activity 3</h3>";
    infoContent = infoContent + "<p>When you buy items from a store then the bill or invoice is usually given to you.";
    infoContent = infoContent + "Activity 3 shows how this invoice looks.";
   
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}