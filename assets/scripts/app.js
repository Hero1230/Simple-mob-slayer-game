const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

const battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
	let logEntry;
	logEntry = {
		event: event,
		value: value,
		finalMonsterHealth: monsterHealth,
		finalPlayerHealth: playerHealth,
	};
	if (
		event === LOG_EVENT_PLAYER_ATTACK ||
		event === LOG_EVENT_PLAYER_STRONG_ATTACK
	) {
		logEntry.target = "MONSTER";
	} else if (
		event === LOG_EVENT_MONSTER_ATTACK ||
		event === LOG_EVENT_PLAYER_HEAL
	) {
		logEntry.target = "PLAYER";
	}
	battleLog.push(logEntry);
}

function reset() {
	currentMonsterHealth = chosenMaxLife;
	currentPlayerHealth = chosenMaxLife;
	resetGame(chosenMaxLife);
}

function endRound() {
	const initialPlayerHealth = currentPlayerHealth;
	const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= monsterDamage;
	writeToLog(
		LOG_EVENT_MONSTER_ATTACK,
		monsterDamage,
		currentMonsterHealth,
		currentPlayerHealth
	);

	if (currentPlayerHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		removeBonusLife();
		currentPlayerHealth = initialPlayerHealth;
		setPlayerHealth(initialPlayerHealth);
		alert("You would be dead but the bonus life saved you!");
	}

	if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert("You won!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"PLAYER WON",
			currentMonsterHealth,
			currentPlayerHealth
		);
		reset();
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
		alert("You lost!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"MONSTER WON",
			currentMonsterHealth,
			currentPlayerHealth
		);
		reset();
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
		alert("You have a draw!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"A DRAW",
			currentMonsterHealth,
			currentPlayerHealth
		);
		reset();
	}
}

function attackMonster(attackValue) {
	const damage = dealMonsterDamage(attackValue);
	currentMonsterHealth -= damage;
	let logEvent;
	if (attackValue === ATTACK_VALUE) {
		logEvent = LOG_EVENT_PLAYER_ATTACK;
	} else {
		logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
	}
	writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
	endRound();
}

function attackHandler() {
	attackMonster(ATTACK_VALUE);
}

function strongAttackHandler() {
	attackMonster(STRONG_ATTACK_VALUE);
}

function healPlayerHandler() {
	let healValue;
	if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
		alert("You can't heal to more than your max inital health.");
		healValue = chosenMaxLife - currentPlayerHealth;
	} else {
		healValue = HEAL_VALUE;
	}
	increasePlayerHealth(healValue);
	currentPlayerHealth += healValue;
	writeToLog(
		LOG_EVENT_PLAYER_HEAL,
		healValue,
		currentMonsterHealth,
		currentPlayerHealth
	);
	endRound();
}

function printLogHandler() {
	console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
