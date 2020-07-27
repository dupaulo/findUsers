let allUsers = [];
let filteredUsers = [];


const searchForm = document.querySelector('form');
const searchInput = searchForm.querySelector('#search-input');
const searchButton = searchForm.querySelector('#search-button');

   async function start() {
      await fetchUsers();
      handleFormSubmit();
      searchInput.focus();
   }
start();

   async function fetchUsers() {
   // Data copied only once to avoid many requests to the original API. The local file will be used.
  /* const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  ); */
      const res = await fetch('./js/apiUsers.json');
      const json = await res.json();
      allUsers = json.results
      .map(
         ({
         name: { first,last },
         picture: { thumbnail },
         dob: { age },
         email,
         gender,
      }) => ({
         name: `${first} ${last}`,
         gender,
         age,
         email,
         photo: thumbnail.replace('https://randomuser.me/api/portraits/thumb/','./img/'),
      })
   )
   .sort((a,b)=> a.name.localeCompare(b.name));
   }

const handleFormSubmit = () =>{
      const search = () => {
         const searchValue = searchInput.value.toLowerCase().trim();
         
         filteredUsers = allUsers.filter(({name})=>
         name.toLowerCase().trim().includes(searchValue)
         );
      };
   const render = () => {
      const countUsers = filteredUsers.length;
      const countMale = filteredUsers.reduce(
         (count,{gender})=>(gender === 'male'? count+1:count),
         0
      );
      const countFem = filteredUsers.reduce(
         (count,{gender})=>(gender==='female'? count+1:count),
         0
      );
      const ageSum = filteredUsers.reduce(
         (accumulator,{age})=>accumulator+age,0
      );
      const ageAvg = ageSum /countUsers;

      const renderUserList = () => {
         const tabUsers = document.querySelector('#tab-users');
      
         let tabUsersContent = `
      <h4> ${countUsers} usuário(s) encontrado(s)</h4>
      <div>
      `;

      filteredUsers.forEach(({name,photo,age,email})=>{
         const userHTML = `
            <div class="user">
               <img src="${photo}" alt="Foto de ${name}" />
               <span> ${name}, ${age} anos.</span>
               <span> Email: ${email}.</span>
               </div>
         `;

         tabUsersContent+= userHTML;
      });

      tabUsersContent+= '</div>';
      tabUsers.innerHTML = tabUsersContent;
      };

      const renderStatistics = () =>{
         const tabStatistics = document.querySelector('#tab-statistics');
         
         let tabStatisticsContent = `
            <h2> Estátisticas </h2>
            <ol>
               <li>Sexo masculino: <strong>${formatNumber(countMale)}</strong></li>
               <li>Sexo feminino: <strong>${formatNumber(countFem)}</strong></li>
               <li>Soma das idades: <strong>${formatNumber(ageSum)}</strong></li>
               <li>Média de idade: <strong>${formatNumber(ageAvg)}</strong></li>
            </ol>
         `;

         tabStatistics.innerHTML = tabStatisticsContent;
      };
      
      const formatNumber = (number)=>{
         return Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(
            number
            );
      };
     
      renderUserList();
      renderStatistics();
   };
   
   searchInput.removeAttribute('disabled');
   
   searchInput.addEventListener('keyup', (event)=>{
      const hasText = !!event.target.value && event.target.value.trim() !=='';

      if(hasText){
         searchButton.removeAttribute('disabled');
      }else{
         searchButton.setAttribute('disabled','');
      }
   });
   
      searchForm.addEventListener('submit',(event)=>{
         event.preventDefault();   
         search();
         render();
         searchInput.focus();
      });
};




















