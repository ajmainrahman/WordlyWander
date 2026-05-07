import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Home from "@/pages/Home";
import Bangladesh from "@/pages/Bangladesh";
import Destination from "@/pages/Destination";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Photos from "@/pages/Photos";
import About from "@/pages/About";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPosts from "@/pages/admin/Posts";
import AdminDestinations from "@/pages/admin/Destinations";
import AdminGallery from "@/pages/admin/Gallery";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-muted-foreground text-sm">Loading...</span></div>;
  if (!user) return <Redirect to="/admin/login" />;
  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/bangladesh">
        <PublicLayout><Bangladesh /></PublicLayout>
      </Route>
      <Route path="/destination/:id">
        <PublicLayout><Destination /></PublicLayout>
      </Route>
      <Route path="/blog">
        <PublicLayout><Blog /></PublicLayout>
      </Route>
      <Route path="/blog/:id">
        <PublicLayout><BlogPost /></PublicLayout>
      </Route>
      <Route path="/photos">
        <PublicLayout><Photos /></PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout><About /></PublicLayout>
      </Route>

      {/* Admin routes — no PublicLayout (admin has its own layout) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <Redirect to="/admin/dashboard" />
      </Route>
      <Route path="/admin/dashboard">
        <AdminGuard><AdminDashboard /></AdminGuard>
      </Route>
      <Route path="/admin/posts">
        <AdminGuard><AdminPosts /></AdminGuard>
      </Route>
      <Route path="/admin/destinations">
        <AdminGuard><AdminDestinations /></AdminGuard>
      </Route>
      <Route path="/admin/gallery">
        <AdminGuard><AdminGallery /></AdminGuard>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AdminAuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AdminAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
