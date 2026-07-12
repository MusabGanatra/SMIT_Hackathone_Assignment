// Load History Records

async function loadHistory(){

const { data, error } =
await supabaseClient
.from("history")
.select("*")
.order("created_at", { ascending:false });

if(error){
console.log(error);
return;
}

let rows = "";

data.forEach(item => {

const date =
new Date(item.created_at)
.toLocaleString();

rows += `
<tr>

<td>${item.action}</td>

<td>${item.actor}</td>

<td>${date}</td>

</tr>
`;

});

document.getElementById("historyTable").innerHTML =
rows;

}


// Initial Load

loadHistory();