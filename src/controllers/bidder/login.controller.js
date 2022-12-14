import { SignJWT } from 'jose';
import Bidder from '../../schemas/bidder.schema.js';

/**
 * Send a JWT if the credentials are correct
 * @param {Object} req
 * @param {Object} res
 * @returns JWT, status and message
 */
const bidderLoginController = async (req, res) => {
	const { email, password } = req.body;

	//validate email
	const bidderByEmail = await Bidder.findOne({ where: { email: email } });
	if (!bidderByEmail)
		return res.status(400).send({
			errors: ['Credenciales incorrectas'],
		});

	//validate password
	const checkPassword = await bidderByEmail.validPassword(
		password,
		bidderByEmail.password
	);

	if (!checkPassword)
		return res.status(400).send({
			errors: ['Credenciales incorrectas'],
		});

	// create and send jwt
	const jwtConstructor = new SignJWT({
		id: bidderByEmail.id,
		email: bidderByEmail.email,
	});
	const encoder = new TextEncoder();
	const jwt = await jwtConstructor
		.setProtectedHeader({
			alg: 'HS256',
			typ: 'JWT',
		})
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encoder.encode(process.env.JWT_PRIVATE_KEY));

	let d = new Date();
	d.setDate(d.getDate() + 7);

	//cookie settings
	res.cookie('jwt', jwt, {
		expires: d,
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
		sameSite: 'none',
	});

	const user = {
		firstName: bidderByEmail.firstName,
		lastName: bidderByEmail.lastName,
	};

	return res.status(200).json({ jwt, user });
};

export default bidderLoginController;
