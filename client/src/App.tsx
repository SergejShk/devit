import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
	const [results, setResults] = useState<number[]>([]);
	const [inputValue, setInputValue] = useState<string | number>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
	};

	const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const element = e.currentTarget.elements.namedItem("number") as HTMLInputElement;
		const value = Number(element.value);
		if (!value) return setError("Enter a number from 1 to 100");

		setError("");
		setIsLoading(true);
		setResults([]);

		makeRequests(1, value, value);
	};

	const makeRequests = (startIndex: number, endIndex: number, step: number) => {
		const MAX_COUNT_REQUEST = 1000;
		const delay = startIndex === 1 ? 0 : 1000;

		if (startIndex > MAX_COUNT_REQUEST) return setIsLoading(false);

		setTimeout(() => {
			const promises = [];
			for (let i = startIndex; i <= endIndex; i += 1) {
				const promise = axios
					.post("http://localhost:8080/api", { index: i })
					.then(({ data }) => setResults((prev) => [...prev, data.index]))
					.catch((err) => console.log(err));

				promises.push(promise);
			}

			Promise.all(promises).then(() => {
				if (endIndex + step > MAX_COUNT_REQUEST || endIndex + step === MAX_COUNT_REQUEST) {
					return makeRequests(startIndex + step, MAX_COUNT_REQUEST, step);
				}

				if (startIndex < MAX_COUNT_REQUEST) {
					makeRequests(startIndex + step, endIndex + step, step);
				}
			});
		}, delay);
	};

	return (
		<>
			<form onSubmit={onFormSubmit}>
				<div className="app__wrapper">
					<input
						className="app__input"
						type="number"
						name="number"
						value={inputValue}
						onChange={onInputChange}
						min={0}
						max={100}
						required
						autoComplete="off"
					/>

					<button className="app__button" type="submit" disabled={isLoading}>
						Start
					</button>
					{!!error && <p className="app__error">{error}</p>}
				</div>
			</form>

			<ul>{results.length > 0 && results.map((result, idx) => <li key={idx}>Index: {result}</li>)}</ul>
		</>
	);
}

export default App;
