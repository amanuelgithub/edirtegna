import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';

const jwtStrategyOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret',
  //   secretOrKeyProvider: undefined,
  //   algorithms: undefined,
  //   audience: undefined,
  //   ignoreExpiration: boolean,
  //   issuer: undefined,
  //   passReqToCallback: false,
  //   jsonWebTokenOptions: {
  //     maxAge: '30d',
  // ...more options here
  //   },
};

const jwtStrategy = new JwtStrategy(jwtStrategyOptions, function (
  jwt_payload,
  done,
) {});

passport.use(jwtStrategy);

export default passport;
