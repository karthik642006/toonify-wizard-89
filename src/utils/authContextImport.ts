
// This file exists to provide a correct import path for AuthContext
// Import the real AuthContext to prevent circular dependencies
import { AuthContext, AuthProvider, useAuth } from '../context/AuthContext';

// Re-export everything
export { AuthContext, AuthProvider, useAuth };
