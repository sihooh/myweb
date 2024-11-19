// league js

// football-api : 4f6051447c0d8a884a12017c079224c3
// rapid-api : 0b8b76dff0mshcc310087a82ec5fp151d12jsn007b19ce9041
var apiKey = '0b8b76dff0mshcc310087a82ec5fp151d12jsn007b19ce9041';

// Top Goal Score : league page
// 유명 리그 id + k 리그만 출력
// 잉글랜드 프리미어 리그 (Premier League): 39
// 스페인 라 리가 (La Liga): 140
// 독일 분데스리가 (Bundesliga): 78
// 프랑스 리그 1 (Ligue 1): 61
// 포르투갈 프리메이라 리가 (Primeira Liga): 94
// 브라질 세리에 A (Brasileirão Série A): 71
// 미국 메이저 리그 사커 (MLS): 253
// 한국 K리그 1: 292
// 일본 J리그: 98
var leagues = [39, 140, 78, 61, 94, 71, 253, 292, 98];
var season = 2024;  

function getRandomLeagueId() {
    const randomIndex = Math.floor(Math.random() * leagues.length);
    return leagues[randomIndex];
}

document.addEventListener('DOMContentLoaded', function() {
    // 데이터 가져오기 함수 호출
    fetchTopScorers();
});

async function fetchTopScorers() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    } else {
        return; // 요소가 없으면 함수 종료
    }


    // 랜덤 리그 ID
    var leagueId = getRandomLeagueId();
    var url = `https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=${leagueId}&season=${season}`;
    
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
        showTop(data);

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // 데이터 로딩 완료 후 로딩 애니메이션 숨김
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
}

function showTop(data) {
    if (!data.response || data.response.length === 0) {
    console.error("No data found for this league.");
    return;
    }

    const leagueName = data.response[0]?.statistics[0]?.league.name || 'Unknown League';
    const table = [];
    
    table.push(`<h2 class="title">${leagueName} Top Scorers 2024</h2><br/>`);

    let rank = 1;

    data.response.slice(0, 10).forEach(playerData => {
    const player = playerData.player;
    const statistics = playerData.statistics[0];

    table.push(`
        <div class="top-info">
            <div class="rank"><strong>RANK</strong> : ${rank}</div>
            <div class="top-images">
                <img src="${statistics.team.logo}" alt="team logo" id="teamLogo">
                <img src="${player.photo}" alt="player photo" id="playerPhoto">
            </div>
            <div class="player-info">
                <div><strong>TEAM</strong> : ${statistics.team.name}</div>
                <div><strong>PLAYER</strong> : ${player.name}</div>
                <div><strong>NATIONALITY</strong> : ${player.nationality}</div>
                <div><strong>POSITION</strong> : ${statistics.games.position}</div>
                <div><strong>GOALS TOTAL</strong> : ${statistics.goals.total}</div>
            </div>
        </div>
    `);

    rank++;
    });
    
    document.getElementById('top-scorers').innerHTML = table.join("");
}

// 데이터를 가져오기 위해 함수 호출
fetchTopScorers();

// league search js
// 돋보기 클릭 시 리그 및 시즌 선택 select, search 버튼이 보이도록
function toggleSearch() {
    const searchContainer = document.getElementById('search-input-container');
    searchContainer.style.display = (searchContainer.style.display === "block") ? "none" : "block";
}

async function searchStandings() {
    const leagueId = document.getElementById('league-select').value;
    const season = document.getElementById('season-select').value;

    if (!leagueId || !season) {
        alert('리그와 시즌을 선택해주세요.');
        return;
    }

    // 로딩중
    document.getElementById('loading').classList.remove('hidden');

    const searchUrl = `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`;

    try {
        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                'x-rapidapi-key': apiKey
            }
        });

        const data = await response.json();
        showStandingsModal(data);
    } catch (error) {
        console.error("Error fetching standings data: ", error);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

function showStandingsModal(data) {
    const modal = document.getElementById('search-modal');
    const standingsContainer = document.getElementById('standings-container');

    standingsContainer.innerHTML = '';

    if(data.response.length > 0) {
        const standings = data.response[0].league.standings[0];

        standings.forEach(team => {
            const card = document.createElement('div');
            card.className = 'standing-card';
            
            card.innerHTML = `
                <div id="modal-title">
                    <h3>Rank: ${team.rank} ${team.team.name}</h3>
                    <img src="${team.team.logo}" alt="${team.team.name} 로고">
                </div>
                <div id="modal-content">
                    <div><strong>POINTS: </strong>${team.points}</div>
                    <div><strong>WIN: </strong>${team.all.win}</div>
                    <div><strong>DRAW: </strong>${team.all.draw}</div>
                    <div><strong>LOSE: </strong>${team.all.lose}</div>
                    <div><strong>GOALS DIFF: </strong>${team.goalsDiff}</div>
                    <div><strong>HOME WIN: </strong>${team.home.win}</div>
                    <div><strong>AWAY WIN: </strong>${team.away.win}</div>
                </div>
            `;
    
            standingsContainer.appendChild(card);
        });

        modal.style.display = 'flex'
    } else {
        alert("해당 리그와 시즌에 대한 순위 정보를 찾을 수 없습니다.")
    }
    
}

function closeModal() {
    const modal = document.getElementById('search-modal');
    modal.style.display = 'none';
}

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