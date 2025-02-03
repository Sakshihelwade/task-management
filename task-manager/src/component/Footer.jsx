export default function Footer() {
    return (
      <footer className="bg-gray-100 text-center py-4 mt-auto">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  