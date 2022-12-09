import FormData from "form-data";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const API_SECRET = process.env.REACT_APP_API_SECRET;

export const pinFileToIPFS = async (fileToHandle) => {
  // initialize the form data
  const formData = new FormData();

  // append the file form data to
  formData.append("file", fileToHandle);
  const metadata = JSON.stringify({
    name: "pic",
    keyvalues: {
      Key: "Value",
    },
  });
  formData.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  formData.append("pinataOptions", pinataOptions);
  // call the keys from .env

  // the endpoint needed to upload the file
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const response = await axios.post(url, formData, {
    maxContentLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET,
    },
  });
  return response.data.IpfsHash;
};

export const pinJSONToIPFS = async (
  image,
  intervention_ipfs,
  name,
  description,
  price,
  intervention_pdf,
  project_name,
  project_description,
  project_id,
  event_type,
  project_country,
  credit_type,
  methodology,
  value_chain,
  shed_name,
  beneficiary,
  reduction_purpose,
  country_of_consumption,
  vintage,
  verified_by,
  date_of_verification,
  date_of_issue
) => {
  // console.log('metadata starting')
  // console.log('image',image)
  // console.log('name',name)
  // console.log('desc',description)
  // console.log('price',price)
  // console.log('uri',"https://gateway.pinata.cloud/ipfs/"+image)

  // the endpoint needed to upload the file
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  if (image && name && description && price) {
    var metaData = {
      image: "https://gateway.pinata.cloud/ipfs/" + image,
      name: name,
      description: description,
      intervention_ipfs:
        "https://gateway.pinata.cloud/ipfs/" + intervention_ipfs,
      price: price,
      project_name: project_name,
      project_description: project_description,
      project_id: project_id,
      event_type: event_type,
      project_country: project_country,
      credit_type: credit_type,
      methodology: methodology,
      value_chain: value_chain,
      shed_name: shed_name,
      beneficiary: beneficiary,
      reduction_purpose: reduction_purpose,
      country_of_consumption: country_of_consumption,
      vintage: vintage,
      verified_by: verified_by,
      date_of_verification: date_of_verification,
      date_of_issue: date_of_issue,
    };
    for (var i = 0; i < intervention_pdf.length; i++) {
      metaData["pdf" + i] =
        "https://gateway.pinata.cloud/ipfs/" + intervention_pdf[i];
    }
    // console.log("final", metaData);
    const metaResponse = await axios.post(url, metaData, {
      headers: {
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRET,
      },
    });
    //   console.log(metaResponse.data.IpfsHash);
    return metaResponse.data.IpfsHash;
  } else {
    console.log("Invalide input");
  }
};
