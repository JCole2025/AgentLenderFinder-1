import React from 'react';
import { Link } from 'wouter';

/**
 * Dashboard/Home page with documentation on how to use the widget
 */
export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <img 
          src="/assets/BPlogo.png" 
          alt="BiggerPockets Logo" 
          className="h-12 mb-4 mx-auto" 
        />
        <h1 className="text-3xl font-bold mb-2">BiggerPockets Agent Finder Widget</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A fully functional lead generation tool for connecting users with specialized real estate agents
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 9h6v6H9z" />
            </svg>
            Widget Demo
          </h2>
          <p className="mb-4 text-gray-600">
            See the agent finder widget in action. Test it out with different inputs to experience the user flow.
          </p>
          <Link href="/finder" className="bg-blue-600 text-white px-6 py-2 rounded inline-block hover:bg-blue-700 transition-colors">
            View Demo
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
              <path d="M20 17V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10" />
              <path d="M20 17H4" />
              <path d="M12 11v4" />
              <path d="m9 13 3-2 3 2" />
            </svg>
            Embed Instructions
          </h2>
          <p className="mb-4 text-gray-600">
            Learn how to integrate the widget into your website. Documentation and code examples provided.
          </p>
          <a href="/embed-demo.html" className="bg-blue-600 text-white px-6 py-2 rounded inline-block hover:bg-blue-700 transition-colors">
            Embedding Guide
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
            <path d="M12 6V2H8" />
            <path d="M7 8H2v4" />
            <path d="M18 11V2h-4" />
            <path d="M7 13v9h4" />
            <path d="M12 18h6v-4" />
            <path d="M17 16l5-5" />
            <path d="M22 12V6" />
          </svg>
          Quick Integration
        </h2>
        <p className="mb-4 text-gray-600">
          The easiest way to add the widget to your website:
        </p>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm mb-6">
          {`<!-- Add this where you want the widget to appear -->
<div id="bp-agent-finder-widget"></div>

<!-- Include the embed script -->
<script src="${window.location.origin}/embed.js"></script>`}
        </pre>
        <p className="text-gray-600">
          For modal popup and customization options, visit the <a href="/embed-demo.html" className="text-blue-600 hover:underline">Embedding Guide</a>.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1 flex-shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>Multi-step form with intelligent navigation</span>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1 flex-shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>Different paths for buy vs. sell transactions</span>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1 flex-shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>HubSpot integration for lead tracking</span>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1 flex-shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>Responsive design that works on all devices</span>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1 flex-shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>Customizable colors and appearance</span>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1 flex-shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>Modal popup option for space-efficient integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}