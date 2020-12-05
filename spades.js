let diff = [0,0,0,0];
let b = [0,0,0,0];
let w = [0,0,0,0];
for (let sim = 0; sim<1; ++sim){
let sumofbet = 0;
let wins = [0,0,0,0];
function getDeck(){
	let deck = [];
	let counter = 0;
	//first column is the suit
	//1 is Diamonds
	for (let d = 2; d<=14; ++d){
		deck.push([1,d]);
	}
	// 2 is Hearts
	for (let h = 3; h<=14; ++h){
		deck.push([2,h]);
	}
	//3 is Clubs
	for (let c = 3; c<=14; ++c){
		deck.push([3,c]);
	}
	//4 is spades
	for (let s = 2; s<=16; ++s){
		deck.push([4,s]);
	}
	return deck
}

//shuffles deck
function shuffle(deck)
{
	for (let i = 0; i < 1000; ++i)
	{
		let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}
//this creates a deck with 52 cards including high and low joker
let deck = getDeck();


//instantiate the players team#player#
let t1p1 = [];
let t1p2 = [];
let t2p1 = [];
let t2p2 = [];
//order of player (clockwise)
let order = [t1p1,t2p1,t1p2,t2p2];
let dealer = 1;

function sortHand(hand){
	let sorted = [[],[],[],[]];
	for (let j=0; j<13; ++j){
		let card = hand[j];
		sorted[card[0]-1].push(card[1]);
	}
	for (let i = 0; i<4; ++i){
		sorted[i].sort((a, b) => a - b);
	}
	return sorted;
}

function deal(deck){
	shuffle(deck);
	for (let i=0; i<4; ++i){
		for (let j= 0; j<13; ++j){
			order[i].push(deck.pop());
	}
}
}






//so far every player now gets dealt a hand of 13 cards, now we have to work on the order of play
//now we need each player to scan their hand for wins
//anything 14 and above will be bet on as a win (aces of non spade suits, top 3 spades = 7 wins) !!
// a king will bet as a victory if that player has the ace of the same suit
//if a player has more than 3 spades, each extra will count as a victory !!
//some hands will count on as a maybe which is a .5 to betting, the first round of betting will round down

function evaluate(order){
	let bet = [0,0,0,0];
	let suitcount = [];
	for (let i= 0; i<4; ++i){
		let spadecount = 0;
		let aces = [false, false, false, false] //diamonds / hearts / clubs / aces
		let kings = [false, false, false, false] 

		for (let j=0; j<13; ++j){
			 let card = order[i][j];
		  
			 if (card[0]===4){
				 spadecount+=1;
		
			 }
			 if (card[1]===14){ //checks to see if they have the ace of each suit
				aces[card[0]-1] = true;
			 }
			 if (card[1]===13){
				kings[card[0]-1] = true;
			}
			 
			 if (card[1]>13){
				 bet[i] = bet[i]+1;
			 }
			 
		}
		for (let j = 0; j<4; ++j){
			if (kings[j] && aces[j]){
				bet[i] = bet[i]+1;
			}
		}
		if (spadecount-3>0){
			bet[i] = bet[i] + (spadecount-3);
		}
		}
		return bet;
}
function suitcount(order){
	let suitcount = [];
	for (let i= 0; i<4; ++i){
		let suits = [0,0,0,0];
		for (let j=0; j<13; ++j){
			 let card = order[i][j];
		   suits[card[0]-1] = suits[card[0]-1] + 1;
		}
		suitcount.push(suits);
	}
		return suitcount;
}



function highest(round){ //takes an array of cards and determines the highest card
	// assumes the last card (because it was pushed) is the beginning card
	let highest = round[0];

	for (let i=0; i<round.length; ++i){
		
		if (round[i][1]===highest[1] && round[i][0]>highest[0]){ //same suit higher card
			highest = round[i];
	} 
		else if (round[i][1] === 4){
			highest = round[i];
		}
	}
	return highest;
}
//succesfully returns the highest card of the round

function highestnonSpade(hand){
	let high = 0;
	let suit = 0;
	let index = 0;
	for (let a = 0; a<3; ++a){
		for (let b = 0; b<hand[a].length; ++b){
			if(hand[a].length>0){
			if (hand[a][b]>high){
				high = hand[a][b];
				suit = a;
				index = b;
			}}
			}
		
	} 
	return [high, suit, index];
}
function highestCardSuit(hand, suit){
	let high = 0;

	let index = 0;

		for (let b = 0; b<hand[suit].length; ++b){
			if (hand[suit][b]>high){
				high = hand[suit][b];
				
				index = b;
			}
			}
		

	return [high, suit, index];
}

function compare(card0, card1){
	if (card0[0]>card1[0]){
		return 0;
	}
	return 1;
}


function remove(player, card){
	order[player][card[1]].splice(card[2],1);
}
function remove2(player, suit, index){
  order[player][suit].splice(index, 1);
}

//hand set up and organization
shuffle(deck);
deal(deck);
console.log("Cards Dealt");
//analysis of hand
let bet = evaluate(order);
console.log("Each PLayer's Bets");
console.log(bet);
console.log("Distribution of suits");
console.log("Diamonds -- Hearts -- Clubs ---- Spades");
console.log(suitcount(order));
let sum = 0;
for (let a = 0; a<4; ++a){
	sum = sum + bet[a];
}
sumofbet = sumofbet + sum;

order = [sortHand(t1p1),sortHand(t2p1),sortHand(t1p2),sortHand(t2p2)];
//console.log("Each Players Initial Hand (Diamonds, Hearts, Clubs, Spades")
//console.log(order[0]);
//console.log(order[1]);
//console.log(order[2]);
//console.log(order[3]);

function orderofPlay(last){
	let order = [0,1,2,3];
	let ord = [10,10,10,10];
	let ind = 0;
	for (let i = last; i<4; ++i){
		ord[ind] = order[i];
		++ind;
	}
	for (let i=0; i<last; ++i){
		ord[ind] = order[i];
		++ind;
	}
	return ord;
}





function play(order){
	let win = 0;
	let used = [[],[],[],[]];
	let top = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
	for (let rounds= 0; rounds<13; ++rounds){
	
	let round = [];
	//round initiated
	
	let first = win; // index of the first player

	
	wins[win] = wins[win]+1;
	let ord = orderofPlay(win); // sets a revolving array for order of play
	
	let card = highestnonSpade(order[first]); // first players first card
	//console.log(order);
	//console.log(card);
	if (card[0]===0){// no non spades left, start throwing high spades
		card = [order[first][3][ order[first][3].length-1  ], 3, 0];
		
	}
	round.push(card);
	order[first][card[1]].splice([card[2]], 1); //removes card from hand
	let firstsuit = card[1];
	
	for (let j = 1; j<4; ++j){
			let i = ord[j];
			let cur = highest(round); // the card to beat 
      //determines if a player is cutting//////
			let cut = false;
			if (order[i][firstsuit].length===0){
				cut = true;
			}
			/////////////////////////////////////////
			
			
			if (cur[1] === firstsuit){ // nobody has cut yet
				if (!cut){ // and you arent cutting
					if((compare(highestCardSuit(order[i], firstsuit), cur)===0) && //you can beat
						(!(round.length === 3 && round[1]===cur)) && //if you are last and your teammate is winning dont beat them
							(!(firstsuit!== 3 && round.length===2 && round[0]===cur && cur[0]===13 && highestCardSuit(order[i],firstsuit)[0]===14)) && //dont play over king if you have ace
							(!(firstsuit!== 3 && round.length===2 && round[0]===cur && cur[0]===14 && highestCardSuit(order[i],firstsuit)[0]===13))){ //dont play king if they place ace (save it)
						round.push(highestCardSuit(order[i], firstsuit)); //play the highest you can
						remove(i, highestCardSuit(order[i], firstsuit));
						win = i;
						}
					
					
					else{ // you cant win play the lowest
						round.push([order[i][firstsuit][0], firstsuit, 0]);
						remove2(i, firstsuit, 0);
					}
				}
				else if (cut){// and you are cutting
						if ((order[i][3].length>0) && // and you have a spade
							(!(round.length === 3 && round[1]===cur))){ //if you are last and your teammate is winning 
							round.push([order[i][3][0], 3, 0]);
							remove2(i, 3, 0);
							win = i;
						}
						else{//no spade play lowest junk card
						  if (firstsuit=== 0){
								if (order[i][1].length > 0 && order[i][2].length> 0){
								
								if (order[i][1][0]>order[i][2][0]){
									round.push([order[i][2][0], 2, 0]);
									remove2(i, 2, 0);
								}
								else{
									round.push([order[i][1][0], 1, 0]);
									remove2(i, 1, 0);
								}
							}
							else if (order[i][1].length>0){
									round.push([order[i][1][0], 1, 0]);
									remove2(i, 1, 0);
							}
							else if (order[i][2].length>0){
									round.push([order[i][2][0], 2, 0]);
									remove2(i, 2, 0);
							}
							}

							else if (firstsuit === 1 ){
							if (order[i][0].length > 0 && order[i][2].length> 0){
								
								if (order[i][0][0]>order[i][2][0]){
									round.push([order[i][2][0], 2, 0]);
									remove2(i, 2, 0);
								}
								else{
									round.push([order[i][0][0], 0, 0]);
									remove2(i, 0, 0);
								}
							}
							else if (order[i][0].length>0){
									round.push([order[i][0][0], 0, 0]);
									remove2(i, 0, 0);
							}
							else if (order[i][2].length>0){
									round.push([order[i][2][0], 2, 0]);
									remove2(i, 2, 0);
							}


							}
							else if (firstsuit === 2 ){
								if (order[i][0].length > 0 && order[i][1].length> 0){
								

								if (order[i][0][0]>order[i][1][0]){
									round.push([order[i][1][0], 1, 0]);
									remove2(i, 1, 0);
								}
								else{
									round.push([order[i][0][0], 0,0]);
									remove2(i, 0, 0);
								}
							}
							else if (order[i][0].length>0){
									round.push([order[i][0][0], 0, 0]);
									remove2(i, 0, 0);
							}
							else if (order[i][1].length>0){
									round.push([order[i][1][0], 1, 0]);
									remove2(i, 1, 0);
							}


							}
							else{//first suit is a spade and you dont have that throw lowest junk card
								if (order[i][0].length>0){
									round.push([order[i][0][0], 0, 0]);
									remove2(i, 0, 0);
								}
								else if (order[i][1].length>0){
									round.push([order[i][1][0], 1, 0]);
									remove2(i, 1, 0);
								}
								else{
									round.push([order[i][2][0], 2, 0]);
									remove2(i, 2, 0);
								}
							}
						
						}
				  
				}
			}
			//////spade has been cut
			else if (cur[1] !== firstsuit && cur[1] === 3){ //someone cut a spade
			
				if (!cut){
					round.push([order[i][firstsuit][0], firstsuit, 0]);
					remove2(i, firstsuit, 0);
				}
				else{ //throw the next highest spade you can 
					let nobetter = false;
					if (order[i][3].length>0){// if you have a spade throw one higher if you can
						let s = 0; 
						while (order[i][3][s]<cur[2]){
							++s;
						}
						if (compare(order[i][3][s],cur)===0){
							nobetter = true;
						}
						if ((!nobetter) && (!(round.length === 3 && round[1]===cur))){ // if you have one higher and your teammate isnt already winning
							round.push([order[i][3][s],3, 0]);
							remove2(i, 3, s);
						
							win = i;
						}
					}
					else if (nobetter===true || order[i][3].length===0){ //if you have no better spade or no spades
					//throw your lowest junk card
						if(order[i][0][0]<order[i][1][0] && order[i][0][0]<order[2][0]){
							round.push([order[i][0][0], 0, 0]);
							remove2(i, 0, 0);
						}
						else if(order[i][1][0]<order[i][0][0] && order[i][1][0]<order[2][0]){
							round.push([order[i][1][0], 1, 0]);
							remove2(i, 1, 0);
						}
						else if(order[i][2][0]<order[i][1][0] && order[i][2][0]<order[0][0]){
							round.push([order[i][2][0], 2, 0]);
							remove2(i, 2, 0);
						}
					}
					}
				
				}
			
				
			}
			
			
			//top[cur[1]][cur[0]] = top[cur[1]][cur[0]] + 1; //records the winning card of each round
			
		
			
			//look at the highest card in the round
			//if you have the firstsuit playd, you must play it
			//if the highst card is a spade and you have first suit, play the lowest of firstsuit
			//if the highst card is first suit: 
			//     if you have firstuit left:
			//         if you can win, play your highest card to beat it
			//         if you cannot, play your lowest card to beat it
			//     if you do not have firstuit left:
			//         if you have a spade, play your lowest spade
			//         else{ play lowest nonSpade;}
			//if the highest card is a spade:
			//       if you have firstuit left: play your lowest firsuit
			//     if you do not have firstsuit:
			//         if you have a higher spade, play it
			//     if you do not have a higher spade
			//         play lowest nonspade
			
		 
		console.log("Round Number " + (rounds+1).toString());
		for (let i = 0; i<4; ++i){
			let player = ord[i];
			console.log("Player" + player.toString() + " "  + round[i].toString());
		}
		console.log("winner of Hand: Player " + win.toString());
		for (let u= 0; u<4; ++u){
			used[round[u][1]].push(round[u]);
		}
    
		
		//console.log(used);
		//console.log(top);
		//console.log(win);
		}}
	//}
//}
play(order);
//console.log(bet);
//console.log(wins);

for (let a =0 ; a<4; ++a){
	diff[a] = diff[a] + (bet[a]-wins[a]);
	b[a] = b[a] + bet[a];
	w[a] = w[a] + wins[a];
}


}
console.log("cumulative bets " + b.toString());
console.log("cumulative wins " + w.toString());
console.log("team 1 wins " + (w[0]+w[2]).toString());
console.log("team 2 wins " + (w[1]+w[3]).toString());
console.log("team 1 diff " + ((b[0]+b[2])-(w[0]+w[2])).toString());
console.log("team 2 diff " + ((b[1]+b[3])-(w[1]+w[3])).toString());
console.log("difference" + diff.toString());

