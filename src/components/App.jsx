import { Component } from 'react';
import shortID from 'shortid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    if (localStorage.getItem('contacts')) {
      this.setState({ contacts: JSON.parse(localStorage.getItem('contacts')) });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
  }

  isAlreadyExist(name) {
    return this.state.contacts.some(
      elem => elem.name.toLowerCase() === name.toLowerCase()
    );
  }

  isEmptyString(str) {
    return str.length === 0;
  }

  addContact = (name, phone) => {
    name = name.trim();
    phone = phone.trim();

    if (this.isEmptyString(name) || this.isEmptyString(phone)) {
      Notify.failure("U can't add empty contact");
      return;
    }

    if (this.isAlreadyExist(name)) {
      Notify.failure(
        'Contact with same name is already exist please entre new name'
      );
      return;
    }

    const newContact = { name, phone, id: shortID.generate() };

    this.setState(({ contacts }) => ({
      contacts: [newContact, ...contacts],
    }));
    this.setState({ filter: '' });
  };

  handleChangeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  deleteContact = contactId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== contactId),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const lowerCaseFilter = filter.toLowerCase();

    const visibleContacts = contacts.filter(
      ({ name, phone }) =>
        name.toLowerCase().includes(lowerCaseFilter) ||
        phone.toLowerCase().includes(lowerCaseFilter)
    );

    return (
      <div>
        <h1 className={'mainTitle'}>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />
        <h2 className={'title'}>Contacts</h2>
        <Filter value={filter} onChange={this.handleChangeFilter} />
        <ContactList
          contacts={visibleContacts}
          onDeleteContact={this.deleteContact}
        />
      </div>
    );
  }
}

export default App;
