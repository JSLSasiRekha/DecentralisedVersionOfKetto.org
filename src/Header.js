import React from "react";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Account from './Account.js';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";


// ... (same code as before)

const HeaderComponent = (props) => {



const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Voting', href: '/voting', current: false},
  { name: 'Create Campaign', href: '/createCampaign', current: false },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


  return (
    <div>
    <Disclosure as="nav" className="bg-indigo-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-800 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
           

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-indigo-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <Avatar src='https://bit.ly/broken-link' className="h-8 w-8" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
            
            <Menu.Items className="absolute z-10 mt-4 bg-white right-0 w-[22rem] origin-top-left rounded-md py-1 focus:outline-none border border-gray-500">
    <Menu.Item className="w-full">
        <Account currentAccount={props.currentAccount}contractInstance={props.contractInstance}/>
      
    </Menu.Item>
</Menu.Items>


                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

        </>
      )}
    </Disclosure>




    </div>
   
  );
};

export default HeaderComponent;
