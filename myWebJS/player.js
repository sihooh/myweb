// player search js
var apiKey = '0b8b76dff0mshcc310087a82ec5fp151d12jsn007b19ce9041';
var playerIds = [ 19,208,1901,1903,4,5,193,11,10,63,12,31,59,30,9,70,29,77,1902,187,35,26];

// 선수 id 랜덤으로 선택
function getRandomPlayerIds(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function fetchPlayerData(playerId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.classList.remove('hidden');

    const url = `https://api-football-v1.p.rapidapi.com/v3/players/profiles?player=${playerId}`;

    try {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        }
    });

    if (!response.ok) {
        if (response.status === 429) {
            console.error("Rate limit exceeded, please wait and try again later.");
            return; 
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
        const data = await response.json();
        return data.response[0];

    }catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
}

// 랜덤 선수 카드 표시
async function displayRandomPlayers() {
    const randomPlayerIds = getRandomPlayerIds(playerIds, 4);
    const playerCardsContainer = document.getElementById('player-cards');
    playerCardsContainer.innerHTML = '';


    for (const playerId of randomPlayerIds) {
        const playerData = await fetchPlayerData(playerId);
        if(!playerData) continue;

        if (playerData) {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');

            playerCard.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <div class="random">?</div>
                    </div>
                    <div class="card-back">
                        <img src="${playerData.player.photo}" alt="${playerData.player.name} photo" class="player-photo">
                        <h3>${playerData.player.name}</h3>
                        <p><strong>Name: </strong>${playerData.player.firstname} ${playerData.player.lastname}</p>
                        <p><strong>Age:</strong> ${playerData.player.age}</p>
                        <p><strong>Position:</strong> ${playerData.player.position}</p>
                        <p><strong>Nationality:</strong> ${playerData.player.nationality}</p>
                        <p><strong>Height:</strong> ${playerData.player.height}</p>
                        <p><strong>Weight:</strong> ${playerData.player.weight}</p>
                    </div>
                </div>
            `;

            playerCard.addEventListener('click', () => {
                playerCard.classList.toggle('flipped');
            });

            playerCardsContainer.appendChild(playerCard);
        }
    }
}

// 페이지 로드 시 무작위 선수 카드 표시
document.addEventListener('DOMContentLoaded', displayRandomPlayers);


// 로고 클릭 시 메뉴 토글
document.addEventListener('DOMContentLoaded', function() {
    const logoIcon = document.getElementById('logoIcon');
    const tab = document.querySelector('.tab');
    
    logoIcon.addEventListener('click', function() {
        if (window.innerWidth <= 600) {
            tab.classList.toggle('active');
        }
    });

    // 화면 크기가 변경될 때 메뉴 상태 초기화
    window.addEventListener('resize', function() {
        if (window.innerWidth > 600) {
            tab.classList.remove('active');
        }
    });

    // 메뉴 항목 클릭 시 메뉴 닫기
    const menuItems = tab.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 600) {
                tab.classList.remove('active');
            }
        });
    });
});