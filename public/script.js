console.log('hello Js');

console.log(firebase);
// ----------------------------

const BUDGET = [];

const addRemoveHTML = document.querySelector("#add-remove");
const addDescriptionHTML = document.querySelector("#input");
const valueHTML = document.querySelector("#value");
const checkBtnHTML = document.querySelector("#check-button");
const amountHTML = document.querySelector("#amount");
const incomeAmount = document.querySelector("#income-amount");
const expenseAmount = document.querySelector("#expense-amount");
const displayIncome = document.querySelector("#bottom-left");
const displayExpense = document.querySelector("#bottom-right");
const incomeTbodyHTML = document.querySelector("#income-tbody")
const expenseTbodyHTML = document.querySelector("#expense-tbody")

checkBtnHTML.addEventListener("click", addBudget);

function addBudget() {
  const addRemove = addRemoveHTML.value;
  const addDescription = addDescriptionHTML.value;
  const value = valueHTML.value;

  console.log(addRemove);
  console.log(addDescription);
  console.log(value);

  BUDGET.push({
    addRemove: addRemove,
    addDescription: addDescription,
    value: value,
  });
  updateTotalBudget();
  updateIncome();
  updateExpenses();
}

let totalAmount = 0;
let totalIncomeAmount = 0
let totalExpenseAmount = 0;
function updateTotalBudget() {
  const totalBudget = +valueHTML.value;
  console.log("totalBudget :", totalBudget);

  if (addRemoveHTML.value == "+") {
    totalAmount = +valueHTML.value + totalAmount;
    amountHTML.innerHTML = totalAmount;

    totalIncomeAmount = +valueHTML.value + totalIncomeAmount;
    incomeAmount.innerHTML = totalIncomeAmount;
  } else {
    totalAmount = totalAmount - +valueHTML.value;
    amountHTML.innerHTML = totalAmount;

    totalExpenseAmount = +valueHTML.value + totalExpenseAmount;
    expenseAmount.innerHTML = totalExpenseAmount;
  }
}


function updateIncome() {
  let incomeRows = "";

  for (let i = 0; i < BUDGET.length; i++) {
    const inc = BUDGET[i];
    if (inc.addRemove === "-") continue;
    incomeRows += `
        <tr>
          <td class="name">${inc.addDescription}</td>
          <td class="income">+${BUDGET[i].value}
          <button onClick="deleteIncome(${i})">
          <img class="remove" src="https://img.icons8.com/ios/28/000000/cancel.png"/></button></td>
        </tr>`;
  }

  incomeTbodyHTML.innerHTML = incomeRows;
}


function updateExpenses() {
  console.log('updateExpenses');
  let expenseRows = "";

  for (let i = 0; i < BUDGET.length; i++) {
    const exp = BUDGET[i];
    if (exp.addRemove === "+") continue;
    expenseRows += `  
    <tr>
      <td class="name">${exp.addDescription}</td>
      <td class="expense">-${BUDGET[i].value}
      <div class="percentage">100%</div>
      <button onClick="deleteExpense(${i})">
      <img class="remove" src="https://img.icons8.com/ios/28/000000/cancel.png"/>
      </button>
      </td>
    </tr>`;
  }

  expenseTbodyHTML.innerHTML = expenseRows;
}

function deleteExpense(index){
    BUDGET.splice(index,1);
    updateExpenses();

}

function deleteIncome(index){
  BUDGET.splice(index,1);
  updateIncome();
  
}

// //////////////////////////

// BASICS

// const db = firebase.firestore()



// adding the document with random uniqe id
// db.collection('names').doc() 
// .set({
//   name: 'Vaishuuuu'
// })


// note
// db.collection('names').doc('bhagat') ---- this will just give the refernece of a document

// adding the document with our docId
// db.collection('names').doc('bhagat').set({
//   name: 'bhagat1'
// })

// db.collection('names').doc('bhagat').set({
//   name: []
// })

// retrive the particular data
// db.collection('names').doc('bhagat').get().then(doc => {
//   const data = doc.data();
//   console.log(data);
// }).catch(error => console.error(error))


// retrive all the docs from collection
// db.collection('names').get().then(snaps => {
//     const docs1 = snaps.docs;
//     // console.log(data);    
//     docs1.map(doc => {
//       const data = doc.data();
//       console.log(data);
//     })
//   }).catch(error => console.error(error))


// retrieve the data on realtime
// db.collection('names').onSnapshot(snaps => {
//     const docs1 = snaps.docs;
//     // console.log(data);    
//     docs1.map(doc => {
//       const data = doc.data();
//       console.log(data);
//     })
//   })

// setInterval(() => {
//   db.collection('names').doc().set({
//     name: ' New Vaishuuuu'
//   })
// }, 5000)



// delete the particular doc

// db.collection('names').doc('bhagat').delete().then(() => {
//   console.log('Deleted');
// }).catch(error => {
//   console.error(error);
// })


// update the doc

// async function update() {
//   const ref = await db.collection('names').doc('03NeKzRHagm4wBCjeXGY');

//   ref.get().then(doc => {
//     const data = doc.data();
//     console.log(data);
//     data.name = 'old chutiya'
//     data.isChutiya = true;
//     ref.update(data).then(() => {
//       console.log('Updated');
//     }).catch(error => {
//       console.error(error);
//     })
//   })
// }
// update()



