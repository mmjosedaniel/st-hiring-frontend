import { Container, Typography } from "@mui/material";
import EventsListTable from "./components/EventsListTable";
import SettingsForm from "./components/SettingsForm";

function App() {
  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Events
      </Typography>

      <SettingsForm/>
      <EventsListTable />
    </Container>
  );
}

export default App;
