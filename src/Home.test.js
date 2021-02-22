import { render, screen } from "@testing-library/react";
import React from "react";
import Home from './Home';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'


describe("Home Compoenet Testing", () => {
    const history = createMemoryHistory()
    it("Home Component", () => {
        render(
            <Router history={history}>
                <Home />
            </Router>
        );
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
    });
    it("Home Component Login Test", () => {
        render(
            <Router history={history}>
                <Home />
            </Router>
        );
        expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
    });
})