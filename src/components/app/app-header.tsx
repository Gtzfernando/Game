import { AppNavigation } from "./app-navigation";
import { LogoutButton } from "./logout-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-organic bg-ivory px-4 py-3 shadow-warm">
        <div className="flex items-center justify-between">
          <AppNavigation />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
