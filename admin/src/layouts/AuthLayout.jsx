export default function AuthLayout({ children }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-300">
            <div className="bg-white p-8 rounded-2xl shadow-md w-[400px]">{children}</div>
        </div>
    );
}
