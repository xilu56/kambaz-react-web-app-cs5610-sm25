import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';

export default function BootstrapForms() {
    return (
    <div id="wd-css-styling-forms">
  <h2>Forms</h2>
  <FormGroup className="mb-3" controlId="wd-email">
    <FormLabel>Email address</FormLabel>
    <FormControl type="email" placeholder="name@example.com" />
  </FormGroup>
  <FormGroup className="mb-3" controlId="wd-textarea">
    <FormLabel>Example textarea</FormLabel>
    <FormControl as="textarea" rows={3} />
  </FormGroup>
</div>
    )
}