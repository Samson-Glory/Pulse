export default function TypingIndicator({ user }) {
  const delays = [0, 200, 400]; // staggered animation delays

  return (
    <div className="flex justify-start mb-2">
      <div className="max-w-[70%] mr-auto">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
          <div className="flex items-center space-x-3">
            {/* Animated dots */}
            <div className="flex space-x-1">
              {delays.map((delay) => (
                <span
                  key={delay}
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce-dots"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium select-none">
              {user.name} is typing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
