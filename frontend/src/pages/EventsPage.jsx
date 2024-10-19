// frontend/src/pages/EventsPage.jsx

import React, { useState, useEffect } from "react";
import {
  Heading,
  Flex,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddEvent } from "../components/AddEvent";
import { EventSearch } from "../components/EventSearch";
import { isAuthenticated } from "../FrontLogin/AuthUtils";
import { Logo } from "../FrontLogin/Logo";
import LogoutButton from "../components/LogoutButton";
import LogoutTimer from "../components/LogoutTimer";
import { LoginModal } from "../components/LoginModal"; // Import LoginModal
import {EventList} from "../components/EventList"; // Import EventList

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
        setFilteredEvents(data);
      } else {
        console.error("Fetched events data is not an array", data);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setFilteredEvents([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
      console.log("Fetched Categories:", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const userIsAuthenticated = isAuthenticated();
  const userId = userIsAuthenticated ? JSON.parse(localStorage.getItem("user"))?.id : null;

  const handleEventClick = (eventId) => {
    if (userIsAuthenticated) {
      navigate(`/event/${eventId}`);
    } else {
      alert("Please log in or sign up to view event details.");
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find((cat) => String(cat.id) === String(id));
    return category ? category.name : "Unknown";
  };

  return (
    <>
      <LogoutTimer />
      <Heading as="h1" textAlign="center" mt="13" fontSize={30}>
        Winc's Events
      </Heading>
      <Container
        maxW="container.lg"
        position="relative"
        mt="4"
        zIndex="2"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Flex
          direction="column"
          align="flex-end"
          position="absolute"
          top="0"
          right="0"
          zIndex="3"
          p="0"
        >
          {userIsAuthenticated && <Logo />}
          {userIsAuthenticated && <LogoutButton />}
        </Flex>

        {!userIsAuthenticated && (
          <LoginModal closeModal={onClose} /> // Use the LoginModal component
        )}
      </Container>

      <AddEvent setFilteredEvents={setFilteredEvents} events={events} categoryIds={[]} userId={userId} />
      <EventSearch events={events} setFilteredEvents={setFilteredEvents} />
      

      {/* Event List */}
      <EventList
        filteredEvents={filteredEvents}
        handleEventClick={handleEventClick}
        getCategoryName={getCategoryName}
      />
    </>
  );
};
