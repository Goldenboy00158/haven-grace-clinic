@@ .. @@
   const getContextForPrint = () => {
     switch (activeTab) {
       case 'inventory': return 'inventory';
       case 'patients': return 'patients';
       case 'transactions': return 'transactions';
       case 'dashboard': return 'dashboard';
+      case 'expenses': return 'expenses';
+      case 'analytics': return 'analytics';
+      case 'services': return 'services';
+      case 'family-planning': return 'family-planning';
       default: return undefined;
     }
   };