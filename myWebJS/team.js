// team search js
var apiKey = '0b8b76dff0mshcc310087a82ec5fp151d12jsn007b19ce9041';

// team js
// team-card
// 리그에 속한 팀의 로고만 card 형식으로 보여주기
// 팀의 로고 클릭 시 팀의 정보 보여주기
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
// const leagues = {
//     "Premier League": [
//         { id: 57, name: "Arsenal" },
//         { id: 58, name: "Chelsea" },
//         { id: 59, name: "Liverpool" },
//         { id: 65, name: "Manchester City" },
//         { id: 66, name: "Manchester United" },
//         { id: 73, name: "Tottenham Hotspur" }
//     ],
//     "La Liga": [
//         { id: 81, name: "FC Barcelona" },
//         { id: 82, name: "Real Madrid" },
//         { id: 83, name: "Atlético Madrid" },
//         { id: 84, name: "Sevilla FC" },
//         { id: 85, name: "Real Betis" },
//         { id: 86, name: "Athletic Bilbao" }
//     ],
//     "Bundesliga": [
//         { id: 90, name: "Bayern Munich" },
//         { id: 91, name: "Borussia Dortmund" },
//         { id: 92, name: "RB Leipzig" },
//         { id: 93, name: "Bayer Leverkusen" },
//         { id: 94, name: "VfL Wolfsburg" },
//         { id: 95, name: "Eintracht Frankfurt" }
//     ],
//     "Ligue 1": [
//         { id: 109, name: "Paris Saint-Germain (PSG)" },
//         { id: 110, name: "Olympique de Marseille" },
//         { id: 111, name: "AS Monaco" },
//         { id: 112, name: "Olympique Lyonnais" },
//         { id: 113, name: "Lille OSC" }
//     ],
//     "Primeira Liga": [
//         { id: 102, name: "FC Porto" },
//         { id: 103, name: "SL Benfica" },
//         { id: 104, name: "Sporting CP" },
//         { id: 105, name: "SC Braga" }
//     ],
//     "Brasileirão Série A": [
//         { id: 130, name: "Flamengo" },
//         { id: 131, name: "Palmeiras" },
//         { id: 132, name: "São Paulo FC" },
//         { id: 133, name: "Santos FC" }
//     ],
//     "MLS": [
//         { id: 204, name: "LA Galaxy" },
//         { id: 205, name: "New York City FC" },
//         { id: 206, name: "Seattle Sounders FC" },
//         { id: 207, name: "Atlanta United FC" }
//     ],
//     "K리그1": [
//         { id: 1906, name: "Jeonbuk Hyundai Motors" },
//         { id: 1907, name: "FC Seoul" },
//         { id: 1908, name: "Suwon Samsung Bluewings" },
//         { id: 1909, name: "Ulsan Hyundai" }
//     ],
//     "J리그": [
//         { id: 181, name: "Kawasaki Frontale" },
//         { id: 182, name: "Yokohama F. Marinos" },
//         { id: 183, name: "Gamba Osaka" },
//         { id: 184, name: "Sanfrecce Hiroshima" }
//     ]
// };
var leagues = [39, 140, 78, 61, 94, 71, 253, 292, 98];

function getRandomLeagueId() {
    const randomIndex = Math.floor(Math.random() * leagues.length);
    return leagues[randomIndex];
}

async function fetchTeamsForLeague(leagueId, season) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.classList.remove('hidden');

    var leagueId = getRandomLeagueId();
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${leagueId}&season=2024`;

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

        // API 응답 데이터 로그 확인
        console.log("API Response:", data);
        
        // 팀 데이터를 화면에 보여주는 함수 호출
        showTeams(data);

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }
}

function showTeams(data) {
    // 응답이 유효한지 확인
    if (!data || !data.response || data.response.length === 0) {
        console.error("No teams found for this league.");
        return;
    }

    const teamCardContainer = document.getElementById('team-card');

    // 각 팀 정보를 카드 형식으로 출력
    data.response.forEach(item => {
        const team = item.team;  // 팀 정보 추출
        const venue = item.venue;  // venue 정보 추출

        const teamCard = document.createElement('div');
        teamCard.classList.add('team-card');

        teamCard.innerHTML = `
        <div>
            <img src="${team.logo}" alt="${team.name} logo" class="team-logo" onclick="showTeamInfo('${team.id}')">
            <p style="font-weight: bold; font-size: 20px;">${team.name}</p>
        </div>    
        `;

        teamCardContainer.appendChild(teamCard); // 팀 카드 추가
    });
}

async function showTeamInfo(teamId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.classList.remove('hidden');

    const url = `https://api-football-v1.p.rapidapi.com/v3/teams?id=${teamId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                'x-rapidapi-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayTeamInModal(data);
    } catch (error) {
        console.error("Error fetching team data:", error);
    } finally {
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }
}

// 모달에 팀 정보 표시
function displayTeamInModal(data) {
    const modal = document.getElementById('team-modal');
    const modalDetails = document.getElementById('team-modal-details');

    if (data.response && data.response.length > 0) {
        const team = data.response[0].team;
        const venue = data.response[0].venue;

        modalDetails.innerHTML = `
            <h2><strong>${team.name}</strong></h2>
            <img src="${team.logo}" alt="${team.name} logo" id="team.logo">
            <p><strong>Founded: </strong>${team.founded}</p>
            <p><strong>Country: </strong>${team.country}</p>
            <p><strong>City: </strong>${venue.city}</p>
            <p><strong>Address: </strong>${venue.address}</p>
        `;
        modal.style.display = "block"; // 모달 표시
    }
}

function closeModal() {
    const modal = document.getElementById('team-modal');
    modal.style.display = "none"; // 모달 숨기기
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('team-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// DOMContentLoaded 이벤트가 발생했을 때 호출
document.addEventListener('DOMContentLoaded', function() {
    fetchTeamsForLeague(); // 리그 ID 39와 시즌 2024의 팀을 가져옵니다.
});


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
