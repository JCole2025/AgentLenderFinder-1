// Test script to verify both MTR/STR options and webhook functionality
import axios from 'axios';

// Sample form data with both MTR and STR selected
const testFormData = {
  finderType: "agent",
  formData: {
    transaction_type: "buy",
    location: "Denver, Colorado",
    property_type: "single_family",
    purchase_timeline: "asap",
    price_min: "300000",
    price_max: "600000",
    loan_started: false,
    owner_occupied: false,
    investment_properties_count: "1",
    strategy: ["short_term_rental", "mid_term_rental"], // Testing both STR and MTR
    timeline: "asap",
    contact: {
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      phone: "555-123-4567",
      city: "Denver",
      state: "CO",
      zip: "80202",
      notes: "This is a test submission to verify both MTR and STR options and webhook functionality."
    },
    terms_accepted: true,
    loan_assistance: false
  }
};

// Function to submit the test data
async function testSubmission() {
  console.log("Starting test submission with both MTR and STR selected");
  console.log("Form data:", JSON.stringify(testFormData, null, 2));
  
  try {
    // Send the test data to the API endpoint
    const response = await axios.post('http://localhost:5000/api/submit-finder', testFormData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Test successful!");
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Test failed with error:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testSubmission();