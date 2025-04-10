import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/pay";

interface PaymentVariables {
  id: number;
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
}

const Payment = () => {
  const session = authClient.useSession();
  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: async (variables: PaymentVariables) => {
      const { id, amount, email, first_name, last_name } = variables;
      const response = await axios.post(
        `${API_BASE_URL}/`,
        { id, amount, email, first_name, last_name },
        {
          withCredentials: true,
        }
      );
      return response.data.checkout_url;
    },
    onSuccess: () => {},
  });

  return {
    paymentMutation,
  };
};

export default Payment;
