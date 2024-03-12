import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
	const [results, setResults] = useState<number[]>([]);
	const [inputValue, setInputValue] = useState<string | number>("");
	const [isLoading, setIsLoading] = useState(false);

	const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
	};

	const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		let indexCount = [];
		for (let i = 1; i <= 1000; i += 1) {
			indexCount.push(i);
		}

		indexCount.map(async (index, idx, arr) => {
			await createPromise(index, Number(inputValue)).finally(() => {
				if (idx === arr.length - 1) {
					setIsLoading(false);
				}
			});
		});

		indexCount = [];
	};

	const makeRequest = async (index: number) => {
		try {
			const { data } = await axios.post("http://localhost:8080/api", { index });

			return data.index;
		} catch (error) {
			console.log(error);
		}
	};

	const createPromise = (index: number, inputValue: number) => {
		const delay = index % inputValue === 0 ? 1000 : 0;

		return new Promise<void>((resolve) => {
			setTimeout(async () => {
				const resIndex = await makeRequest(index);
				setResults((prev) => [...prev, resIndex]);

				resolve();
			}, delay);
		});
	};

	return (
		<>
			<form onSubmit={onFormSubmit}>
				<input
					className="app__input"
					type="number"
					name="number"
					value={inputValue}
					onChange={onInputChange}
					min={0}
					max={100}
					required
				/>

				<button className="app__button" type="submit" disabled={isLoading}>
					Start
				</button>
			</form>

			<ul>{results.length > 0 && results.map((result, idx) => <li key={idx}>Index: {result}</li>)}</ul>
		</>
	);
}

export default App;
