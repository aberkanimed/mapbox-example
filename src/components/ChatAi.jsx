import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'

export default function ChatAi({ open, setOpen }) {
  const [messageStack, setMessageStack] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  function generateStringWithTimestamp(prefix) {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  const addMessage = () => {
    if (messageInput.trim() !== '') {
      const newMessage = {
        id: generateStringWithTimestamp('you'),
        logoSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        username: 'You',
        message: messageInput
      };
      setMessageStack(prevStack => [...prevStack, newMessage]);
      setMessageInput('');
      setTimeout(generateResponse, 2000); 
    }
  }

  const generateResponse = () => {
    const newMessage = {
      id: generateStringWithTimestamp('step-ai'),
      logoSrc: '../public/images/vdflogo.png',
      username: 'STEP AI',
      message: 'lorem Ipsum'
    };
    setMessageStack(prevStack => [...prevStack, newMessage]);
  }

  function handleInputChange(event) {
    setMessageInput(event.target.value);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Panel title
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {
                          messageStack.map((element) => (
                            <div key={element.id} className='mt-4 px-2 py-4 rounded-md bg-blue-200 text-gray-700'>
                                <div className='flex items-center gap-2'>
                                    <img
                                        className="inline-block h-10 w-10 rounded-full"
                                        src={element.logoSrc}
                                        alt=""
                                    />
                                    <div className='text-sm font-semibold'>{element.username}</div>
                                </div>
                                <p className='mt-2 px-2'>{element.message}</p>
                            </div>
                          ))
                        }
                      </div>
                      <div className='flex-end px-4 sm:px-6'>
                        <div className="mt-2 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SparklesIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                value={messageInput}
                                onChange={handleInputChange}
                                type="text"
                                name="message"
                                id="message"
                                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Ask STEP AI"
                            />
                            </div>
                            <button
                            onClick={() => addMessage()}
                            type="button"
                            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                            <PaperAirplaneIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Ask
                            </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
