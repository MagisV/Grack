// App.js
import { useCallback, useEffect } from "react";
import AppNavigator from "./components/AppNavigator";
import { createTables, connectToDatabase } from "./database/Schema";
import { seedDatabase } from "./database/Seeder";
import { SEED } from "./constants";

const App = () => {
    const DB_NAME = 'graph.db';

    const initialiseDatabase = useCallback(async () => {
        try {
            const db = await connectToDatabase(DB_NAME);
            await createTables(db);
            if (SEED) {
                // Seed the database, only runs if no data is present
                await seedDatabase(db);
            }
        } catch (error) {
            console.error('Error initializing database: ', error);
        }
    }, []);

    useEffect(() => {
        console.log('initialising database on first load')
        initialiseDatabase();
    }, []);

    return <AppNavigator />;
};

export default App;
