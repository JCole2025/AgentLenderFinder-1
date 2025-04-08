
import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function createHubSpotContact(contactData: any) {
  try {
    console.log('Attempting to create HubSpot contact with data:', contactData);
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

    const response = await hubspotClient.crm.contacts.basicApi.create({ properties });
    console.log('HubSpot API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.body
    });
    return response;
  } catch (error) {
    console.error('Error creating HubSpot contact:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}
