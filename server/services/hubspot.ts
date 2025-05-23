
import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ 
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  scopes: ['contacts', 'crm.objects.contacts.write']
});

export async function createHubSpotContact(contactData: any) {
  try {
    console.log('HubSpot Integration Check:');
    console.log('1. Access Token:', process.env.HUBSPOT_ACCESS_TOKEN ? '✓ Present' : '✗ Missing');
    console.log('2. Contact Data:', JSON.stringify(contactData, null, 2));
    const properties = {
      firstname: contactData.contact.first_name,
      lastname: contactData.contact.last_name,
      email: contactData.contact.email,
      phone: contactData.contact.phone,
      state: contactData.contact.state,
      transaction_type: contactData.transaction_type,
      property_type: contactData.property_type,
      investment_strategy: contactData.strategy?.join(', '),
      timeline: contactData.timeline,
      price_range: `${contactData.price_min} - ${contactData.price_max}`
    };

    console.log('Creating HubSpot contact with properties:', properties);
    const response = await hubspotClient.crm.contacts.basicApi.create({ properties });
    console.log('HubSpot API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.body,
      contact: response.properties
    });
    return response;
  } catch (error) {
    console.error('Error creating HubSpot contact:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    if (error.response) {
      console.error('HubSpot API Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw error;
  }
}
