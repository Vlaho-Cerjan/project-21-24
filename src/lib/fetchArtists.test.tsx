import React from "react";
import { beforeEach, describe, it, vi } from "vitest";
import { fetchArtists } from "./fetchArtists";
import { act, fireEvent, render, screen } from "test/utilities";
import { Artist } from "../interfaces/content/artist";
import { debounce } from "lodash";

const TestingComponent = () => {
    const [searchValue, setSearchValue] = React.useState("");
    const [selectedArtists, setSelectedArtists] = React.useState<Artist[] | null>(null);
    const [currentArtists, setCurrentArtists] = React.useState<Artist[]>([]);
    const [loading, setLoading] = React.useState(false);
    const abortController = new AbortController();

    const debouncedChangeHandler = React.useMemo(
        () => debounce(fetchArtists, 500)
        , []);

    return (
        <>
            <div data-testid="searchValue">{searchValue}</div>
            <input
                data-testid="searchInput"
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    debouncedChangeHandler(e.target.value, selectedArtists, setCurrentArtists, setLoading, abortController.signal);
                }}
            />
            <select data-testid="selectedArtists">
                {selectedArtists?.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                        {artist.name}
                        <button data-testid="removeArtist" onClick={() => {
                            setSelectedArtists(selectedArtists.filter((artist) => artist.id !== artist.id));
                        }}>
                            Remove
                        </button>
                    </option>
                ))}
            </select>
            <select data-testid="currentArtists">
                {currentArtists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                        {artist.name}
                        <button data-testid="addArtist" onClick={() => {
                            selectedArtists ? setSelectedArtists([...selectedArtists, artist]) : setSelectedArtists([artist]);
                        }}>
                            Add
                        </button>
                    </option>
                ))}
            </select>
            <div data-testid="loading">{loading.toString()}</div>
        </>
    )
};

describe("fetchArtists", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should return artists", async () => {
        act(() => {
            render(<TestingComponent />);
        });

        const searchInput = screen.getByTestId("searchInput");
        const searchValue = screen.getByTestId("searchValue");
        const selectedArtists = screen.getByTestId("selectedArtists");
        const currentArtists = screen.getByTestId("currentArtists");
        const loading = screen.getByTestId("loading");

        expect(searchValue).toHaveTextContent("");

        expect(selectedArtists).toHaveTextContent("");
        expect(currentArtists).toHaveTextContent("");

        expect(loading).toHaveTextContent("false");

        searchInput.focus();

        fireEvent.keyDown(searchInput, { key: "t", code: "t" });
        fireEvent.keyDown(searchInput, { key: "e", code: "e" });
        fireEvent.keyDown(searchInput, { key: "s", code: "s" });
        fireEvent.keyDown(searchInput, { key: "t", code: "t" });

        act(() => {
            vi.runAllTimers();
        });

        expect(searchValue).toHaveTextContent("test");

        expect(selectedArtists).toBeEmptyDOMElement();

        expect(currentArtists).toBeEmptyDOMElement();
    });
});