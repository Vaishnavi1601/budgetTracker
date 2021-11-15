const addRemoveHTML = document.querySelector("#add-remove");
const addDescriptionHTML = document.querySelector("#input");
const valueHTML = document.querySelector("#value");
const checkBtnHTML = document.querySelector("#check-button");
const amountHTML = document.querySelector("#amount");
const incomeAmountHTML = document.querySelector("#income-amount");
const expenseAmountHTML = document.querySelector("#expense-amount");
const displayIncomeHTML = document.querySelector("#bottom-left");
const displayExpenseHTML = document.querySelector("#bottom-right");
const incomeTbodyHTML = document.querySelector("#income-tbody");
const expenseTbodyHTML = document.querySelector("#expense-tbody");
const percentageHTML = document.querySelector('#percentage');
const dateHTML = document.querySelector('#date');
const expensePercentageHTML = document.querySelector('#expense-percentage');

checkBtnHTML.addEventListener("click", addBudget);

const db = firebase.firestore();

// let incomeAmount = 0;
// let expenseAmount = 0
// let budget = incomeAmount + expenseAmount;
let BUDGET = 0;
let localTotalExpense = 0;
let localTotalIncome = 0;
let percentage = 0;

async function addBudget() {
  const addRemove = addRemoveHTML.value;
  const addDescription = addDescriptionHTML.value;
  const value = valueHTML.value;

  console.log(addRemove);
  console.log(addDescription);
  console.log(value);

  if(!addDescription || !value || value <= 0 ) return;

  
  const userData = {
    description: addDescription,
    value: value,
  };
  
  if (addRemove === "+") {
    const ref = await db.collection("income").doc("income");
    const doc = await ref.get();
    // console.log(doc);
    const data = await doc.data();
    if (data) {
      console.log(data);
      data.allIncomes.push(userData);
      ref.update(data); //updating in database
    } else {
      const allIncomes = [userData];
      ref.set({ allIncomes: allIncomes });
    }

    const totalIncomeRef = await db
      .collection("totalIncome")
      .doc("totalIncome");
    const totalIncomeDoc = await totalIncomeRef.get();
    const totalIncomeData = await totalIncomeDoc.data();
    if (totalIncomeData) {
      let totalIncomes = +totalIncomeData.totalIncomes;
      totalIncomes += +value;
      totalIncomeData.totalIncomes = totalIncomes;
      totalIncomeRef.update(totalIncomeData);
      // incomeAmountHTML.innerHTML = totalIncomes;
    } else {
      // const totalIncome = +value;
      totalIncomeRef.set({ totalIncomes: +value });
    }
    // incomeAmountHTML.innerHTML =  totalIncomeData.totalIncomes;
}


   else {
    const ref = await db.collection("expense").doc("expense");
    const doc = await ref.get();

    const data = await doc.data();
    if (data) {
      data.allExpenses.push(userData);
      ref.update(data);
    } else {
      const allExpenses = [userData];
      ref.set({ allExpenses: allExpenses });
    }

    const totalExpenseRef = await db
      .collection("totalExpense")
      .doc("totalExpense");
    const totalExpenseDoc = await totalExpenseRef.get();
    const totalExpenseData = await totalExpenseDoc.data();

    if (totalExpenseData) {
      let totalExpenses = +totalExpenseData.totalExpenses;
      totalExpenses += +value;
      totalExpenseData.totalExpenses = totalExpenses; //updating
      totalExpenseRef.update(totalExpenseData);
    } 
    else {
      totalExpenseRef.set({ totalExpenses: +value });
    }
  }

}

async function updateIncome() {
  const ref = await db.collection("income").doc("income");
  const doc = await ref.get();
  const data = await doc.data();
  let incomeRows = "";

  for (let i = 0; i < data.allIncomes.length; i++) {
    const inc = data.allIncomes[i];
    incomeRows += `
    <tr>
      <td class="name">${inc.description}</td>
      <td class="income">+${inc.value}
        <button id="btn" onClick="deleteIncome(${i})">
          <img class="remove" src="https://img.icons8.com/plasticine/24/000000/filled-trash.png"/>
        </button>
      </td>
    </tr>`;
  }

  incomeTbodyHTML.innerHTML = incomeRows;
}
// updateIncome();

async function updateExpenses() {
  console.log("updateExpenses");
  const ref = await db.collection("expense").doc("expense");
  const doc = await ref.get();
  const data = await doc.data();
  let expenseRows = "";

  for (let i = 0; i < data.allExpenses.length; i++) {
    const exp = data.allExpenses[i];
    // console.log(exp);
    expenseRows += `  
    <tr>
      <td class="name">${exp.description}</td>
      <td class="expense">${exp.value}
      <div id="percentage">100%</div>
      <button onClick="deleteExpense(${i})">
      <img class="remove" src="https://img.icons8.com/plasticine/24/000000/filled-trash.png"/></button></td>

    </tr>`;
  }
  expenseTbodyHTML.innerHTML = expenseRows;
}

// updateExpenses();

async function deleteIncome(index){
  const ref = await db.collection("income").doc("income");
  const doc = await ref.get();
  const data = await doc.data();

  const totalIncomeRef = await db.collection("totalIncome").doc("totalIncome");
  const totalIncomeDoc = await totalIncomeRef.get();
  const totalIncomeData = await totalIncomeDoc.data();

  let currentTotalIncome = parseInt(totalIncomeData.totalIncomes);
  currentTotalIncome -= Number(data.allIncomes[index].value);
  totalIncomeData.totalIncomes = currentTotalIncome;

  totalIncomeRef.update(totalIncomeData)

  data.allIncomes.splice(index,1);
  await ref.update(data)
}

async function deleteExpense(index){
  const ref = await db.collection("expense").doc("expense");
  const doc = await ref.get();
  const data = await doc.data();

  const totalExpenseRef = await db.collection("totalExpense").doc("totalExpense");
  const totalExpenseDoc = await totalExpenseRef.get();
  const totalExpenseData = await totalExpenseDoc.data();

  let currentTotalExpense = parseInt(totalExpenseData.totalExpenses);
  currentTotalExpense -= Number(data.allExpenses[index].value);
  totalExpenseData.totalExpenses = currentTotalExpense;

  totalExpenseRef.update(totalExpenseData);

  data.allExpenses.splice(index, 1)
  await ref.update(data)
  // updateExpenses()

}

db.collection('income').doc('income').onSnapshot(snap => {
  const data = snap.data();

  let incomeRows = "";

  for (let i = 0; i < data.allIncomes.length; i++) {
    const inc =  data.allIncomes[i];
    incomeRows += `
    <tr>
      <td class="name">${inc.description}</td>
      <td class="income">+${parseFloat(inc.value).toFixed(2)}
      <button onClick="deleteIncome(${i})">
      <img class="remove" src="https://img.icons8.com/plasticine/24/000000/filled-trash.png"/></button></td>
      
    </tr>`;
  }
  incomeTbodyHTML.innerHTML = incomeRows;
})

 db.collection('expense').doc('expense').onSnapshot(async(snap) => {
  const data = snap.data();
  
  const totalIncomeRef =  await db.collection("totalIncome").doc("totalIncome");
  const totalIncomeDoc =  await totalIncomeRef.get();
  const totalIncomeData = await totalIncomeDoc.data();
  
  const totalExpenseRef =  await db.collection("totalExpense").doc("totalExpense");
  const totalExpenseDoc = await totalExpenseRef.get();
  const totalExpenseData = await totalExpenseDoc.data();

  

  let expenseRows = "";
  for (let i = 0; i < data.allExpenses.length; i++) {
    const exp = data.allExpenses[i];
    let incomePercent =totalIncomeData.totalIncomes;
  // let expensePercent = totalExpenseData.totalExpenses;
    // console.log(incomePercent);
    // console.log(exp.value);
    // console.log(+exp.value/+incomePercent);
    // console.log((+exp.value/+incomePercent)*100);
   let percentage = (+exp.value/+incomePercent)*100 ;
   percentage = Math.round(percentage) ;
    // console.log(exp); 
    expenseRows += `  
    <tr>
      <td class="name">${exp.description}</td>
      <td class="expense">${parseFloat(exp.value).toFixed(2)}
      <div class="percentage">${percentage}%</div>
      <button onClick="deleteExpense(${i})">
      <img class="remove" src="https://img.icons8.com/plasticine/24/000000/filled-trash.png"/></button></td>

      </button>
      </td>
    </tr>`; 
  }
  expenseTbodyHTML.innerHTML = expenseRows;
})

db.collection("totalIncome").doc("totalIncome").onSnapshot(snap => {
  const data = snap.data();
  incomeAmount =+ data.totalIncomes;
  incomeAmountHTML.innerHTML = parseFloat(data.totalIncomes).toFixed(2);
  localTotalIncome = +data.totalIncomes;
  calBudget()
  })


db.collection("totalExpense").doc("totalExpense").onSnapshot(snap => {
  const data = snap.data();
  expenseAmount =+ data.totalExpenses;
  expenseAmountHTML.innerHTML = parseFloat(data.totalExpenses).toFixed(2);
  localTotalExpense = +data.totalExpenses;
  calBudget()

})


function calBudget() {
  BUDGET = localTotalIncome - localTotalExpense; 
  if(BUDGET >= 0){
    amountHTML.innerHTML = parseFloat(BUDGET).toFixed(2);
  }
  else{
  amountHTML.innerHTML =" Expenses exceeding income "
    
  }
 
  let expensePercentage = (+localTotalExpense/+localTotalIncome)*100;
  expensePercentage = Math.round(expensePercentage);
  if(expensePercentage > 0){
  expensePercentageHTML.innerHTML = expensePercentage + '%';

  }
  else{
  expensePercentageHTML.innerHTML = 0+'%';

  }
  console.log(expensePercentage);
}


const date = new Date();
const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
const month = allMonths[date.getMonth()];
const year = date.getFullYear();

dateHTML.innerHTML = month + ' ' + year;