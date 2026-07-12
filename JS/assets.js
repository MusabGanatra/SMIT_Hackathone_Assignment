// Add Asset

async function addAsset(){

const assetName =
document.getElementById("assetName").value;

const category =
document.getElementById("category").value;

const location =
document.getElementById("location").value;

const condition =
document.getElementById("condition").value;


if(assetName === ""){
alert("Please Enter Asset Name");
return;
}

const assetCode =
"AST-" + Date.now();


const { error } =
await supabaseClient
.from("assets")
.insert([
{
asset_code: assetCode,
name: assetName,
category: category,
location: location,
condition: condition,
status: "Operational"
}
]);


if(error){
alert(error.message);
return;
}

alert("Asset Added Successfully");


document.getElementById("assetName").value = "";
document.getElementById("category").value = "";
document.getElementById("location").value = "";

loadAssets();
}



// Load Assets

async function loadAssets(){

const { data, error } =
await supabaseClient
.from("assets")
.select("*")
.order("created_at",{ascending:false});

if(error){
console.log(error);
return;
}

let rows = "";

data.forEach(asset=>{

let statusClass =
asset.status === "Operational"
? "status-operational"
: "status-issue";

rows += `
<tr>

<td>${asset.asset_code}</td>

<td>${asset.name}</td>

<td>${asset.category}</td>

<td>${asset.location}</td>

<td class="${statusClass}">
${asset.status}
</td>

<td>

<a href="asset-details.html?id=${asset.id}">
View
</a>

|

<a href="#"
onclick="deleteAsset('${asset.id}')">
Delete
</a>

</td>

</tr>
`;

});

document.getElementById("assetTable").innerHTML =
rows;
}



// Delete Asset

async function deleteAsset(id){

const confirmDelete =
confirm("Are you sure you want to delete this asset?");

if(!confirmDelete){
return;
}

const { error } =
await supabaseClient
.from("assets")
.delete()
.eq("id",id);

if(error){
alert(error.message);
return;
}

alert("Asset Deleted");

loadAssets();
}



// Search Asset

function searchAsset(){

const value =
document.getElementById("searchBox")
.value
.toLowerCase();

const rows =
document.querySelectorAll("#assetTable tr");

rows.forEach(row=>{

if(
row.innerText
.toLowerCase()
.includes(value)
){
row.style.display = "";
}
else{
row.style.display = "none";
}

});

}



// Initial Load

loadAssets();