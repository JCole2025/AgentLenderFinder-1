
import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function createHubSpotContact(contactData: any) {
  try {
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
    return response;
  } catch (error) {
    console.error('Error creating HubSpot contact:', error);
    throw error;
  }
}
