import React from 'react';

const DashboardCard = ({ view, label, icon, onClick, color }) => {
  return (
    React.createElement('button',
      {
        onClick: () => onClick(view),
        className: `group flex flex-col items-center justify-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out ${color}`
      },
      React.createElement('div', { className: "p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300" },
        React.cloneElement(icon, { className: "h-8 w-8 sm:h-10 sm:w-10 text-gray-800 dark:text-gray-200" })
      ),
      React.createElement('h2', { className: "text-lg sm:text-xl font-bold text-gray-900 dark:text-white text-center" }, label)
    )
  );
};

const HomeDashboard = ({ setActiveView }) => {
  const sections = [
    {
      view: 'stock',
      label: 'Stock Hisab',
      icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" })),
      color: 'hover:border-blue-500 dark:hover:border-blue-400'
    },
    {
      view: 'cheques',
      label: 'Cheques',
      icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" })),
      color: 'hover:border-red-500 dark:hover:border-red-400'
    },
    {
      view: 'accounts',
      label: 'Accounts',
      icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" })),
      color: 'hover:border-green-500 dark:hover:border-green-400'
    },
    {
      view: 'contacts',
      label: 'Contacts',
      icon: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" })),
      color: 'hover:border-yellow-500 dark:hover:border-yellow-400'
    }
  ];

  return (
    React.createElement('div', null,
        React.createElement('h1', { className: "text-3xl font-bold mb-8 text-center" }, "Jitpur Kirana Dashboard"),
        React.createElement('div', { className: "grid grid-cols-2 gap-4 sm:gap-6" },
            sections.map(section => (
                React.createElement(DashboardCard, 
                    { key: section.view,
                    view: section.view,
                    label: section.label,
                    icon: section.icon,
                    onClick: setActiveView,
                    color: section.color }
                )
            ))
        )
    )
  );
};

export default HomeDashboard;
