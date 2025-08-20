import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobForm from '../components/JobForm.jsx';

export default function AddJob() {
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const id = addJob(values);
    navigate(`/job/${id}`);
  };

  return (
    <section>
      <h2>Add job</h2>
      <JobForm onSubmit={handleSubmit} submitLabel="Add job" />
    </section>
  );
}
