# BiggerPockets Agent and Lender Finder Widget

A comprehensive BiggerPockets agent and lender finder tool that simplifies real estate transaction processes through an intelligent, multi-step form interface with robust data persistence and analytics capabilities.

## Key Features

- Multi-step form workflows for both agent finder and lender finder
- Location and property validation
- Session-based progress saving
- Webhook integrations for form submissions
- Responsive design optimized for all devices
- Comprehensive error handling and validation

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on the example `.env.example`
4. Start the development server with `npm run dev`

## Webhook Configuration

This application uses webhooks to send form data to external systems. Configure the following environment variables in your `.env` file:

- `WEBHOOK_ENDPOINT_COMPLETE`: Endpoint for complete form submissions
- `WEBHOOK_ENDPOINT_PARTIAL`: Endpoint for partial form submissions (progress tracking)
- `WEBHOOK_ENDPOINT_FAILURES`: Endpoint for logging submission failures

You can use services like [webhook.site](https://webhook.site) for testing.

## License

Copyright © 2025 BiggerPockets, Inc. All rights reserved.