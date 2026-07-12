// Get Asset ID From URL

const params =
new URLSearchParams(window.location.search);

const assetId =
params.get("id");


// Load Asset Details

async function loadAsset(){

if(!assetId){
alert("Asset ID Missing");
return;
}

const { data, error } =
await supabaseClient
.from("assets")
.select("*")
.eq("id", assetId)
.single();

if(error){

console.log(error);

document.getElementById("assetInfo").innerHTML = `
<p>Asset Not Found</p>
`;

return;
}


// Show Asset Information

document.getElementById("assetInfo").innerHTML = `

<h2>${data.name}</h2>

<p>
<strong>Asset Code:</strong>
${data.asset_code}
</p>

<p>
<strong>Category:</strong>
${data.category}
</p>

<p>
<strong>Location:</strong>
${data.location}
</p>

<p>
<strong>Condition:</strong>
${data.condition}
</p>

<p>
<strong>Status:</strong>
${data.status}
</p>

`;


// Generate Public URL

const publicUrl =
window.location.origin +
window.location.pathname.replace(
"asset-details.html",
"public-asset.html"
)
+
"?id=" +
data.id;


// Generate QR Code

QRCode.toCanvas(
document.getElementById("qrcode"),
publicUrl,
function(error){

if(error){
console.error(error);
}

}
);


// Set Public Link

document.getElementById("publicLink")
.href =
publicUrl;

}


// Run Function

loadAsset();