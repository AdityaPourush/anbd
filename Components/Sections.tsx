import React from 'react'

const Wishes = () => {
  return (
    <div className="w-full sm:h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white p-8">
          <div className="max-w-2xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Wishing You the Best Birthday Ever! 🎂</h2>
            <p className="text-xl md:text-2xl mb-8">
              May your day and year and life be filled with joy, laughter, and all the things you love the most.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-2xl font-semibold mb-2">Gifts</h3>
                <p>May you receive all the gifts you've been wishing for!</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl mb-4">🎂</div>
                <h3 className="text-2xl font-semibold mb-2">Cake</h3>
                <p>May your cake be as sweet as your smile!</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-semibold mb-2">Joy</h3>
                <p>May your year and life ahead be filled with happiness!</p>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Wishes;